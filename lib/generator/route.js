import {
  response,
  header,
  authentication,
  validator
} from '../middlewares'

const format = s => (s[0].toUpperCase() + s.slice(1)).slice(0,-1)

import models from './model'

export default class {
  
  constructor (router, name, model, schemas) {
    
    this.router  = router
    this.name    = name
    this.model   = model
    this.schemas = schemas

  }

  async get (ctx, next) {
    
    try {

      const { id } = ctx.params,
            refs = Object.values(this.schemas).filter(o => o.ref),
            user_id = ctx.user.id,
            joins = {}
      
      for (let item of refs) {
        
        let { ref } = item
        
        ref = ref.toLowerCase()

        switch (item.relation) {
          
          case 'belongsTo':
              joins[ref] = true
            break
          case 'hasMany':
              // filter
              joins[ref + 's'] = {

              }
            break

        }


      }

      let data = await this.model.get(id).getJoin(joins)

      ctx.body = response(200, data, null)

    } catch (e) {
      
      ctx.body = response(400, null, e)
      ctx.status = 400

    }

  }

  async post (ctx, next) {
    
    try {

      let { body } = ctx.request,
          refs = Object.values(this.schemas).filter(o => o.ref),
          { id } = ctx.user

      for (let item of refs) {
        
        let { ref } = item
      
        if (ref === 'User') {

          ref = ref.toLowerCase() + 'Id'
          
          body[ref] = id

        } else if (item.relation === 'belongsTo') {

          ref = ref.toLowerCase() + 'Id'
          
          body[ref] = body[ref]
 
        }

      }

      let data = await new this.model(body).save()
 
      ctx.body = response(200, data, null)

    } catch (e) {
      
      ctx.body = response(400, null, e)
      ctx.status = 400

    }

  }

  async put (ctx, next) {

    try {

      let { body } = ctx.request,
          { id } = ctx.params
      
      let data = await this.model.get(id).update(body).run()
      
      ctx.body = response(200, data, null)

    } catch (e) {
      
      ctx.body = response(400, null, e)
      ctx.status = 400

    }

  }

  async del (ctx, next) {
    
    try {
      
      const { id } = ctx.params

      let data = await this.model.get(id)

      data = await data.delete()
 
      ctx.body = response(200, data.isSaved(), null)
      ctx.status = 200

    } catch (e) {
      
      ctx.body = response(400, null, e)
      ctx.status = 400

    }

  }

  async relation (ctx, next) {
    
    try {

      const { id, ref } = ctx.params,
            model = models[format(ref)]

      let data = await model.filter({
        [ctx.schema+'Id']: id 
      }).run()
      
      ctx.body = response(200, data, null)      

    } catch (e) {

      ctx.body = response(400, null, e)
      ctx.status = 400

    }

  }

  routes () {

    let name = this.name.toLowerCase()
      
    // get 
    this.router.get(`${name}/:id`,
                    header,
                    authentication,
                    validator,
                    this.get.bind(this))

    // post
    this.router.post(`${name}`,
                    header,
                    authentication,
                    validator,
                    this.post.bind(this))

    // del
    this.router.del(`${name}/:id`,
                    header,
                    authentication,
                    validator,
                    this.del.bind(this))

    // put
    this.router.put(`${name}/:id`,
                    header,
                    authentication,
                    validator,
                    this.put.bind(this))

    // relation routes
    this.router.get(`${name}/:id/:ref`,
                header,
                authentication,
                validator,
                this.relation.bind(this))


  }

}
