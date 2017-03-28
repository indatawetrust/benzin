const router = require('koa-router')(),
      jwt = require('jsonwebtoken'),
      {
        response,
        authentication,
        header,
        User,
      } = require('../middlewares')

router.post('/', header, async function (ctx, next) {
  
  try {
  
    let { body } = ctx.request

    let data = await User.filter({
      username: body.username 
    }).run()

    if (!data.length) {

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

router.post('/auth', header, async function (ctx, next) {
  
  try {
  
    let { body } = ctx.request,
        {
          username,
          password
        } = body,
        { id } = ctx.params

    let data = await User.filter({
      username,
      password
    }).run()

    if (data.length) {

      let user = data[0],
          { id } = user,
          token = jwt.sign({ username, }, 'secret', { expiresIn: 60 * 60 })

      user = await User.get(id).update({
        token,
      }).run()

      ctx.body = response(200, user, null)

    } else {

      ctx.body = response(400, null, {
        message: 'login failed'
      })
    
    }

  } catch (e) {

    ctx.body = response(400, null, e)
    ctx.status = 400

  }

})

module.exports = router;
