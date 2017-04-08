import response from './response'
import authentication from './authentication'
import header from './header'
import validator from './validator'
import isMine from './ismine'
import models from '../generator/model'

export default {
  response,
  authentication,
  header,
  validator,
  isMine,
  User: models['User'],
}
