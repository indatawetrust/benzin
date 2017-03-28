const thinky = require('thinky')(),
      type = thinky.type,
      json = require('../../benzin'),
      { models } = json,
      modelNames = Object.keys(models),
      schemas = []

for (let model of modelNames) {
  
  const m = models[model],
        keys = Object.keys(m),
        schema = {}

  for (let key of keys) {
      
    if (m[key].type) {
      switch (m[key].type.toLowerCase()) {
        case "string":
          schema[key] = type.string()
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

module.exports = schemas
