import response from './response'
import authentication from './authentication'
import header from './header'
import validator from './validator'
import isMine from './ismine'
import isOne from './isone'
import delRef from './delref'
import isRef from './isref'
import models from '../generator/model'

export default {
  response,
  authentication,
  header,
  validator,
  isMine,
  isOne,
  delRef,
  isRef,
  User: models['User'],
}
