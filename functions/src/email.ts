import axios from 'axios'
import * as FormData from 'form-data'
import { EMAIL_SENDER_DOMAIN, MAILGUN_API_KEY } from './env'
import { EmailApiOutcome, intoEmailApiOutcome } from './email-utils'


const NEWSLETTER_NAME = 'newsletter'

export const addSubscriberToMailingList = async (email: string): Promise<EmailApiOutcome> => {
  const form = new FormData()

  form.append('subscribed', 'yes')
  form.append('address', email)

  const mailingList = `${NEWSLETTER_NAME}@${EMAIL_SENDER_DOMAIN}`

  const endpoint = `https://api.mailgun.net/v3/lists/${mailingList}/members`

  try {
    await axios.post(endpoint, form, {
      auth: {
        username: 'api',
        password: MAILGUN_API_KEY,
      },
      headers: form.getHeaders(),
    })

    return EmailApiOutcome.Success
  } catch (err) {
    return intoEmailApiOutcome(err)
  }
}

