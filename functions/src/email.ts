import axios from 'axios'
import * as FormData from 'form-data'
import { EMAIL_SENDER_DOMAIN, MAILGUN_API_KEY } from './env'


const NEWSLETTER_NAME = 'newsletter'

export const addSubscriberToMailingList = async (email: string): Promise<void> => {
  const form = new FormData()

  form.append('subscribed', 'yes')
  form.append('address', email)

  const mailingList = `${NEWSLETTER_NAME}@${EMAIL_SENDER_DOMAIN}`

  const endpoint = `https://api.mailgun.net/v3/lists/${mailingList}/members`

  await axios.post(endpoint, form, {
    auth: {
      username: 'api',
      password: MAILGUN_API_KEY,
    },
    headers: form.getHeaders(),
  })
}


