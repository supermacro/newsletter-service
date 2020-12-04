import axios from 'axios'
import * as FormData from 'form-data'
import { EMAIL_SENDER_DOMAIN, MAILGUN_API_KEY } from './env'
import { EmailApiOutcome, intoEmailApiOutcome } from './email-utils'


const NEWSLETTER_NAME = 'newsletter'
const MAILING_LIST = `${NEWSLETTER_NAME}@${EMAIL_SENDER_DOMAIN}`

const createEndpoint = (path: string) =>
  `https://api.mailgun.net/v3/${path}`


type Operation = 'subscribe' | 'unsubscribe'


interface MailgunApiData {
  endpoint: string
  form: FormData
  httpMethod: 'post' | 'put'
}


const createMailgunApiData = (op: Operation, email: string): MailgunApiData => {
  const form = new FormData()

  if (op === 'subscribe') {
    form.append('subscribed', 'yes')
    form.append('address', email)

    return {
      form,
      endpoint: createEndpoint(`lists/${MAILING_LIST}/members`),
      httpMethod: 'post',
    }
  } else {
    form.append('subscribed', 'no')

    return {
      form,
      endpoint: createEndpoint(`lists/${MAILING_LIST}/members/${email}`),
      httpMethod: 'put',
    }
  }
}


const createRequest = (op: Operation) => (email: string): Promise<EmailApiOutcome> => {
  const { form, endpoint, httpMethod } = createMailgunApiData(op, email)

  return axios({
    url: endpoint,
    method: httpMethod,
    data: form,
    headers: form.getHeaders(),
    auth: {
      username: 'api',
      password: MAILGUN_API_KEY,
    }
  })
  .then(() => EmailApiOutcome.Success)
  .catch(intoEmailApiOutcome)
}


export const addSubscriberToMailingList = createRequest('subscribe')

export const unsubscribeUserFromMailingList = createRequest('unsubscribe')

