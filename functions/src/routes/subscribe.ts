import validator from 'validator'
import { addSubscriberToMailingList } from '../email'
import { createRoute, Validator } from '../router'
import { intoHandlerResult } from '../utils'


const emailValidator: Validator<string> = ({ email }) =>
  (typeof email === 'string' && validator.isEmail(email))
    ? email
    : null

export default createRoute(emailValidator, (email) =>
  addSubscriberToMailingList(email.toLowerCase())
    .then(intoHandlerResult)
)

