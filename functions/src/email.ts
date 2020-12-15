import axios from 'axios'
import * as FormData from 'form-data'
import { EmailApiOutcome, intoEmailApiOutcome } from './email-utils'
import {
  PERSONAL_NEWSLETTER_NAME,
  PV_NEWSLETTER_NAME,
  MAILGUN_API_KEY,
  EMAIL_END_USERS,
  PERSONAL_EMAIL_SENDER_DOMAIN,
  PV_EMAIL_SENDER_DOMAIN,
} from './env'


const createEndpoint = (path: string) =>
  `https://api.mailgun.net/v3/${path}`


interface MailingListInfo {
  listName: string
  senderDomain: string
}

type Operation
  = { name: 'Subscribe' | 'Unsubscribe'; email: string, mailingList: MailingListInfo }
  | { name: 'SendNewsletter'; subject: string; body: string, mailingList: MailingListInfo }


interface MailgunApiData {
  endpoint: string
  form: FormData
  httpMethod: 'post' | 'put'
}


const createMailgunApiData = (op: Operation): MailgunApiData => {
  const { listName, senderDomain } = op.mailingList
  const form = new FormData()

  switch (op.name) {
    case 'Subscribe': {
      form.append('subscribed', 'yes')
      form.append('address', op.email)

      return {
        form,
        endpoint: createEndpoint(`lists/${listName}/members`),
        httpMethod: 'post',
      }
    }

    case 'Unsubscribe': {
      form.append('subscribed', 'no')

      return {
        form,
        endpoint: createEndpoint(`lists/${listName}/members/${op.email}`),
        httpMethod: 'put',
      }
    }

    case 'SendNewsletter': {
      form.append('from', `Giorgio Delgado <${listName}>`)
      form.append('to', listName)
      form.append('subject', op.subject)
      form.append('text', op.body)


      if (!EMAIL_END_USERS) {
        form.append('o:testmode', 'yes')
      }

      return {
        form,
        endpoint: createEndpoint(`${senderDomain}/messages`),
        httpMethod: 'post',
      }
    }
  }
}


const createRequest = (op: Operation): Promise<EmailApiOutcome> => {
  const { form, endpoint, httpMethod } = createMailgunApiData(op)

  return axios({
    url: endpoint,
    method: httpMethod,
    data: form,
    headers: form.getHeaders(),
    auth: {
      username: 'api',
      password: MAILGUN_API_KEY,
    },
  })
  .then(() => EmailApiOutcome.Success)
  .catch(intoEmailApiOutcome)
}


const getMailingListFromVal = (val?: unknown): MailingListInfo => {
  const personalList = `${PERSONAL_NEWSLETTER_NAME}@${PERSONAL_EMAIL_SENDER_DOMAIN}`
  const parlezVousList = `${PV_NEWSLETTER_NAME}@${PV_EMAIL_SENDER_DOMAIN}`

  return val === 'parlezvous'
    ? { listName: parlezVousList, senderDomain: PV_EMAIL_SENDER_DOMAIN }
    : { listName: personalList, senderDomain: PERSONAL_EMAIL_SENDER_DOMAIN }
}


export const addSubscriberToMailingList = (email: string, mailingList: unknown) =>
  createRequest({
    name: 'Subscribe',
    email,
    mailingList: getMailingListFromVal(mailingList),
  })


// TODO: send query parameter for the parlezvous list
export const unsubscribeUserFromMailingList = (email: string, mailingList?: unknown) =>
  createRequest({
    name: 'Unsubscribe',
    email,
    mailingList: getMailingListFromVal(mailingList),
  })

// TODO: send query parameter for the parlezvous list
export const sendNewsletter = (body: string, subject: string, mailingList?: unknown) =>
  createRequest({
    name: 'SendNewsletter',
    body,
    subject,
    mailingList: getMailingListFromVal(mailingList),
  })


