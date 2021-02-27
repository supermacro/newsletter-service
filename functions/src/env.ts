import * as functions from 'firebase-functions'
import { isObject, isString } from './utils'


type EnvConfig = Record<string, unknown>


const newsletterConfig = functions.config().newsletter


if (!isObject(newsletterConfig)) {
  throw new Error('Invalid environment variable config')
}

const verifyEnv = (envName: keyof EnvConfig): string => {
  const value = newsletterConfig[envName]
  
  if (!isString(value)) {
    throw new Error(`Invalid '${envName}' variable: ${value}`)
  }

  return value
}


export const MAILGUN_API_KEY = verifyEnv('mailgun_api_key')

export const PERSONAL_EMAIL_SENDER_DOMAIN = verifyEnv('personal_email_sender_domain')
export const PERSONAL_NEWSLETTER_NAME = verifyEnv('personal_newsletter_name')

export const PV_EMAIL_SENDER_DOMAIN = verifyEnv('pv_email_sender_domain')
export const PV_NEWSLETTER_NAME = verifyEnv('pv_newsletter_name')

export const AUTH_SECRET = verifyEnv('auth_secret')

export const TEST_NEWSLETTER_NAME = verifyEnv('test_newsletter_name')

