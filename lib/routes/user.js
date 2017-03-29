const router = require('koa-router')(),
      jwt = require('jsonwebtoken'),
      bcrypt = require('bcrypt'),
      {
        response,
        authentication,
        header,
        validator,
        User,
      } = require('../middlewares')

router.post('/', header, validator, async function (ctx, next) {
  
  try {
  
    let { body } = ctx.request

    const salt = bcrypt.genSaltSync(5)
    const hash = bcrypt.hashSync(body.password, salt)

    let data = await User.filter({
      username: body.username,
    }).run()

    if (!data.length) {

      delete body.password

      body.hash = hash

      data = await User(body).save()

      ctx.body = response(200, data, null)

    } else {

      ctx.body = response(400, null, {
        message: 'username not available'
      })
    
    }

  } catch (e) {
    
    ctx.body = response(400, null, e)
    ctx.status = 400

  }

})

router.post('/auth', header, validator, async function (ctx, next) {
  
  try {
  
    let { body } = ctx.request,
        {
          username,
          password
        } = body,
        { id } = ctx.params

    let data = await User.filter({
      username,
    }).run()
    
    let { hash } = data[0]
    
    if (data.length) {

      if (bcrypt.compareSync(password, hash)){

        let user = data[0],
            { id } = user,
            token = jwt.sign({ username, }, 'secret', { expiresIn: 60 * 60 })

        user = await User.get(id).update({
          token,
        }).run()

        ctx.body = response(200, user, null)

      } else {
        
        throw 'login failed'

      }

    } else {

      throw 'login failed'
    
    }

  } catch (e) {
    
    ctx.body = response(400, null, e)
    ctx.status = 400

  }

})

module.exports = router;
