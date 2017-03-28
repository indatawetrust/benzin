import response from './response'
import authentication from './authentication'
import header from './header'
import models from '../generator/model'

export default {
  response,
  authentication,
  header,
  User: models['User'],
}
