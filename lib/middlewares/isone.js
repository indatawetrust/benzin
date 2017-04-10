import response from './response'
import { models, schemas } from '../generator/schema'
import e from 'elek'
import _ from 'lodash'

const capitalize = s => s[0].toUpperCase() + s.slice(1),
      id = s => s.toLowerCase() + 'Id'

// hasOne relation control

export default async (ctx, next) => {

  try {

    let { method, url, body } = ctx.request,
        model = url.split('/')[1],
        userId = ctx.user.id 
    
    body = Object.assign({
      userId,
    })
    
    for (let i in models) {

      let hasOne = e(models[i], 'relation')
                   .filter(r => r.relation === 'hasOne'
                             && r.ref === capitalize(model))
                   .length
      
      if (hasOne) {

        const refId = body[id(i)],
              ref = await schemas[capitalize(i)].get(refId)

        const refs = await schemas[capitalize(model)].filter({
          [id(i)]: refId
        }).run()

        if (refs.length) throw 'this can only be one'

      }

    }

    await next()

  } catch (e) {
 
    ctx.body = response(400, null, e)
    ctx.status = 400

  }

}
