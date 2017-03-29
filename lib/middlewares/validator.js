import { models } from '../../benzin'
import response from './response'

const capitalize = s => s[0].toUpperCase() + s.slice(1)

export default async (ctx, next) => {
  
  try { 
    
    let { method, url, body } = ctx.request,
        { id } = ctx.params,
        model = url.split('/')[1]

    model = models[capitalize(model)]
    
    switch (method) {
      
      case 'GET':

          ctx.vals.id = id

          ctx.validateQuery('id').isUuid('v4')

        break
      case 'POST':

          for (let m  in model) {
            const { validations } = model[m]

            if (validations) {
              
              ctx.vals[m] = body[m]
              
              for (let i in validations) {
                
                switch (i) {
                  case 'length':
                      let min = parseInt(validations[i].split(' ')[0]),
                          max = parseInt(validations[i].split(' ')[1])

                      ctx.validateQuery(m).isLength(min, max)
                    break
                  case 'isString':
                      ctx.validateQuery(m).isString()
                    break
                  case 'isNumeric':
                      ctx.validateQuery(m).isNumeric()
                    break
                  case 'isAlpha':
                      ctx.validateQuery(m).isAlpha()
                    break
                }

              }

              
            }
          }

        break
      case 'PUT':

          ctx.vals.id = id

          ctx.validateQuery('id').isUuid('v4')
 
        break
      case 'DELETE':

          ctx.vals.id = id

          ctx.validateQuery('id').isUuid('v4')

        break

    }

    await next()

  } catch (e) {
    
    ctx.body = response(400, null, e)
    ctx.status = 400

  }

}
