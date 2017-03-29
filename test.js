import test from 'ava'
import supertest from 'supertest'
import faker from 'faker'
import { models } from './benzin.json'
import _ from 'lodash'

let schemas = ['User']

for (let i in models) {
  for (let j in models[i]) {
    if (models[i][j]) {
      if (models[i][j].ref) {
        switch (models[i][j].relation) {
          case 'hasMany':
              schemas.push(i)
            break
          case 'belongsTo':
              schemas.push(i)
            break
        }
      }
    }
  }
}

const request = supertest('http://localhost:3000')

// variables
let user = {}

test('index', async t => {

  const res = await request.get('/'),
        { status } = res
  
  t.is(status, 200)

})

test('user sign up', async t => {

  const password = faker.internet.password()
 
  const res = await request
                    .post('/user')
                    .send({
                      username: faker.internet.userName(),
                      password,
                    }),
        { status, body } = res,
        { data } = body
  
  user = data
  user.password = password

  t.is(status, 200)

})

test('user sign in', async t => {
  
  const res = await request
                    .post('/user/auth')
                    .send({
                      username: user.username,
                      password: user.password
                    }),
        { status, body } = res,
        { data } = body,
        { token } = data
  
  user.token = token

  t.is(status, 200)

})
