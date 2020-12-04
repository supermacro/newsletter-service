import { addSubscriberToMailingList } from '../email'
import { createRoute } from '../router'
import { intoHandlerResult, emailValidator } from '../utils'


export default createRoute(emailValidator, (email) =>
  addSubscriberToMailingList(email.toLowerCase())
    .then(intoHandlerResult)
)

