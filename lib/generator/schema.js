const thinky = require('thinky')({
        host: 'rethink'
      }),
      type = thinky.type,
      json = require('../benzin'),
      e = require('elek').default,
      _ = require('lodash'),
      { models } = json,
      schemas = [],
      typeModels = []

const format = s => s.toLowerCase() + 'Id'

models['User'] = Object.assign({
  username: {
    type: 'String'
  },
  hash: {
    type: 'String'
  },
  token: {
    type: 'String'
  }
}, models['User'])

const modelNames = Object.keys(models)

for (let model of modelNames) {
  
  const m = models[model],
        keys = Object.keys(m),
        schema = {}

  for (let key of keys) {
      
    if (m[key].type) {

      switch (m[key].type.toLowerCase()) {
        case 'string':
            schema[key] = type.string()
          break
        case 'boolean':
            schema[key] = type.boolean()
          break
        case 'number':
            schema[key] = type.number()
          break
        case 'date':
            schema[key] = type.date()
          break
        case 'object':
            schema[key] = type.object()
          break
        case 'virtual':
            schema[key] = type.virtual()
          break
        case 'any':
            schema[key] = type.any()
          break
      }

    } else if (m[key].ref) {
      
      let { ref } = m[key]

      ref = ref.toLowerCase() + 'Id'

      schema[ref] = type.string() 

    }
  
  }

  schema['created_at'] = type.date()
  schema['updated_at'] = type.date()
  
  schemas[model] = thinky.createModel(model, schema)
  typeModels[model] = m

}

module.exports = {
  schemas,
  models: typeModels
}
