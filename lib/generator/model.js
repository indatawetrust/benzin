const thinky = require('thinky')(),
      type = thinky.type,
      json = require('../../benzin'),
      { models } = json,
      modelNames = Object.keys(models),
      schemas = []

schemas['User'] = thinky.createModel('User', {
  username: type.string(),
  hash: type.string(),
  token: type.string() 
})

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

}

// relations
for (let i in models) {
  
  for (let s of Object.values(models[i]).filter(s => s.ref)) {

    if (s.ref === 'User') {
      schemas['User'].hasMany(schemas[i],
                              i.toLowerCase() + 's',
                              "id",
                              i.toLowerCase() + 'Id')
    }
    
    switch (s.relation) {
      case 'belongsTo':
          schemas[i].belongsTo(schemas[s.ref],
                               s.ref.toLowerCase(),
                               s.ref.toLowerCase() + 'Id',
                               "id")
        break
      case 'hasMany':
          schemas[i].hasMany(schemas[s.ref],
                             s.ref.toLowerCase() + 's',
                             "id",
                             i.toLowerCase() + 'Id')
        break
    }

  }

}

//schemas['Post'].belongsTo(schemas['User'], "user", "userId", "id");



module.exports = schemas
