const json = require('../benzin'),
      e = require('elek').default,
      _ = require('lodash'),
      { schemas } = require('./schema'),
      { models } = json

// relations
for (let i in models) {
  
  for (let s of Object.values(models[i]).filter(s => s.ref)) {

    if (s.ref === 'User') {
      schemas['User'].hasMany(schemas[i],
                              i.toLowerCase() + 's',
                              "id",
                              'userId')
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
      case 'hasOne':
          schemas[i].hasOne(schemas[s.ref],
                            s.ref.toLowerCase(),
                            "id",
                            i.toLowerCase() + 'Id')
        break
    }

  }

}

module.exports = schemas
