var router = require('koa-router')(),
    json = require('../../benzin'),
    models = require('../generator/model'),
    routeGenerate = require('../generator/route')

for (let m in json.models) {

  let refs = Object.keys(json.models[m]).filter(s => {
    return json.models[m][s].ref
  })

  let gen = new routeGenerate(router, m, models[m], json.models[m])

  gen.routes()

}

router.get('/', async function (ctx, next) {
  
  ctx.body = +new Date()

})

module.exports = router;
