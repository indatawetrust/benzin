export default class {
  
  constructor (router, name, model, schemas) {
    
    this.router  = router
    this.name    = name
    this.model   = model
    this.schemas = schemas

  }

  async get (ctx, next) {
    
    try {

      const { id } = ctx.params

      let data = await this.model.get(id)
      
      ctx.body = data

    } catch (e) {
      
      ctx.body = e
      ctx.status = 400

    }

  }

  async post (ctx, next) {
    
    try {

      let { body } = ctx.request

      let model = await new this.model(body).save()
 
      ctx.body = model

    } catch (e) {
      
      ctx.body = e
      ctx.status = 400

    }

  }

  async put (ctx, next) {

    try {

      let { body } = ctx.request,
          { id } = ctx.params
      
      let data = await this.model.get(id).update(body).run()
      
      ctx.body = data

    } catch (e) {
     console.log(e) 
      ctx.body = e
      ctx.status = 400

    }

  }

  async del (ctx, next) {
    
    try {
      
      const { id } = ctx.params

      let data = await this.model.get(id)

      data = await data.delete()

      ctx.body = data.isSaved()

    } catch (e) {
      
      ctx.body = e
      ctx.status = 400

    }

  }

  routes () {

    let name = this.name.toLowerCase()
      
    // get 
    this.router.get(`${name}/:id`, this.get.bind(this))
    // post
    this.router.post(`${name}`, this.post.bind(this))
    // del
    this.router.del(`${name}/:id`, this.del.bind(this))
    // put
    this.router.put(`${name}/:id`, this.put.bind(this))

  }

}
