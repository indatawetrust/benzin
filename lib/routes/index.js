var router = require('koa-router')(),
    json = require('../benzin'),
    models = require('../generator/model'),
    routeGenerate = require('../generator/route'),
    e = require('elek').default

const format = s => s.toLowerCase()

// relation fixer
for (let i in json.models) {
  
  const refs = e(json.models[i], 'ref')
  
  for (let j in json.models) {
  
    refs.map(({ ref, relation }) => {

      if (j === ref) {

        switch (relation) {
          
          case 'hasOne':
              json.models[j][format(i)] = {
                ref: i,
                relation: 'belongsTo'
              }
            break
          case 'hasMany':
              json.models[j][format(i) + 's'] = {
                ref: i,
                relation: 'belongsTo'
              }
            break

        }

      }

    })

  }

}

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
