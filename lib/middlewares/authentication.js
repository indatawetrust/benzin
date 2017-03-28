import response from './response'
import models from '../generator/model'
import jwt from 'jsonwebtoken'

const User = models['User']

/*
 *eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE0OTA3MzA5MjIsImV4cCI6MTQ5MDczNDUyMn0.DNd-sRUrfazxxlxPxC_uFaBWJioue5G-ilCdFdZqUZ0
 */

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
