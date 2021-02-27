import axios from 'axios'
import * as FormData from 'form-data'
import { EmailApiOutcome, intoEmailApiOutcome } from './email-utils'
import {
  PERSONAL_NEWSLETTER_NAME,
  PV_NEWSLETTER_NAME,
  MAILGUN_API_KEY,
  PERSONAL_EMAIL_SENDER_DOMAIN,
  PV_EMAIL_SENDER_DOMAIN,
  TEST_NEWSLETTER_NAME,
} from './env'


export type Newsletter = 'personal' | 'parlezvous' | 'testnewsletter'

const personalList = `${PERSONAL_NEWSLETTER_NAME}@${PERSONAL_EMAIL_SENDER_DOMAIN}`
const parlezVousList = `${PV_NEWSLETTER_NAME}@${PV_EMAIL_SENDER_DOMAIN}`
const testingList = `${TEST_NEWSLETTER_NAME}@${PERSONAL_EMAIL_SENDER_DOMAIN}`

const createEndpoint = (path: string) =>
  `https://api.mailgun.net/v3/${path}`


interface MailingListInfo {
  listName: string
  senderDomain: string
}

type Operation
  = {
      name: 'Subscribe' | 'Unsubscribe'
      email: string
      mailingList: MailingListInfo
  }
  | {
      name: 'SendNewsletter'
      subject: string
      body: string
      mailingList: MailingListInfo
      testMode: boolean
  }


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
      // TODO: implement plaintext email 
      // form.append('text', op.textBody)
      form.append('html', op.body) 


      if (op.testMode) {
        form.append('o:testmode', 'yes')
      } else if (listName !== testingList) {
        throw new Error('NOT READY FOR THE BIG SHOW')
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
  if (val === 'parlezvous') {
    return { listName: parlezVousList, senderDomain: PV_EMAIL_SENDER_DOMAIN }
  }

  if (val === 'personal') {
    return { listName: personalList, senderDomain: PERSONAL_EMAIL_SENDER_DOMAIN }
  }

  return { listName: testingList, senderDomain: PERSONAL_EMAIL_SENDER_DOMAIN }
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
export const sendNewsletter = (body: string, subject: string, testMode: boolean, mailingList?: unknown) =>
  createRequest({
    name: 'SendNewsletter',
    body,
    subject,
    mailingList: getMailingListFromVal(mailingList),
    testMode,
  })


