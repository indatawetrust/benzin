import response from './response'
import models from '../generator/model'
import jwt from 'jsonwebtoken'

const User = models['User']

export default async (ctx, next) => {
  
  try {

    const { authorization } = ctx.headers
      
    let token = authorization.replace('Bearer ', '')

    token = jwt.verify(token, 'secret')

    const { username } = token
    
    let data = await User.filter({
      username,
    })

    if (data.length) {

      ctx.user = data[0]
  
      await next()

    } else {
      
      throw 'authorization failed'
    
    }

  } catch (e) {
    
    ctx.body = response(401, null, {
      message: 'authorization failed'
    })
 
    ctx.status = 401

  }  

}
