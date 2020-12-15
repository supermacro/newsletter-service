import { addSubscriberToMailingList } from '../email'
import { createRoute } from '../router'
import { intoHandlerResult, emailValidator } from '../utils'


export default createRoute(emailValidator, (email, queryParams) =>
  addSubscriberToMailingList(email.toLowerCase(), queryParams?.list)
    .then(intoHandlerResult)
)

