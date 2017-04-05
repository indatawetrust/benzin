var router = require('koa-router')(),
    json = require('../benzin'),
    models = require('../generator/model'),
    routeGenerate = require('../generator/route')

delete json.models['User']

for (let m in json.models) {

  let gen = new routeGenerate(router, m, models[m], json.models[m])

  gen.routes()

}

router.get('/', async function (ctx, next) {
  
  ctx.body = {
    api: 'v0'
  }

})

module.exports = router;
