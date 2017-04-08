import response from './response'
import models from '../generator/model'
import jwt from 'jsonwebtoken'

const User = models['User']

export default async (ctx, next) => {
  
  try {

    const { authorization } = ctx.headers
      
    let tokenHeader = authorization.replace('Bearer ', '')

    let token = jwt.verify(tokenHeader, 'secret')

    const { username } = token
    
    let data = await User.filter({
      username,
      token: tokenHeader,
    })

    if (data.length) {

      let user = data[0]

      delete user.hash
      delete user.token

      ctx.user = user
  
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
