import response from './response'
import assert from 'assert'
import models from '../generator/model'

const format = s => (s[0].toUpperCase() + s.slice(1))

export default async (ctx, next) => {

  try {
 
    let { url, method } = ctx.request,
        paths = url.split('/'),
        model = paths[1],
        data = {}

    model = models[format(model)]

    switch (method) {
      
      case 'PUT':
      case 'DELETE':  
          
          data = await model.get(paths.pop())

          if (data.userId === ctx.user.id) {
            
            await next()

          } else {
            
            throw 'this is not your'

          }

        break

      default:
        throw 'unknown method'

    } 

  } catch (e) {
  
    ctx.body = response(400, null, e)
    ctx.status = 400

  }

}
