import { createRoute, Validator } from '../router'
import { isString, intoHandlerResult } from '../utils'
import { sendNewsletter, Newsletter } from '../email'

interface SendNewsletter {
  emailBody: string
  subject: string
  testMode: boolean
  newsletter: Newsletter
}

const ACTIVE_NEWSLETTERS: Newsletter[] = [
  'personal',
  'parlezvous',
  'testnewsletter',
]


const isValidNewsletter = (val: unknown): val is Newsletter => {
  const newsletters: string[] = [ ...ACTIVE_NEWSLETTERS ]

  return isString(val) && newsletters.includes(val)
}


const validator: Validator<SendNewsletter> = ({
  emailBody,
  subject,
  sendToSubscribers,
  newsletter,
}) => {
  if (!isString(emailBody)) {
    return null
  }

  if (!isString(subject)) {
    return null
  }

  if (!isValidNewsletter(newsletter)) {
    return null
  }

  const testMode = sendToSubscribers !== true

  return {
    emailBody,
    subject,
    testMode,
    newsletter,
  }
}


export default createRoute(validator, ({ emailBody, subject, testMode }) => {
  const htmlEmailString = Buffer.from(emailBody, 'base64').toString()

  return sendNewsletter(
    htmlEmailString,
    subject,
    testMode
  ).then(intoHandlerResult)
})

