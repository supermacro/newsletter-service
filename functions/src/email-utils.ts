import { AxiosError } from 'axios'
import { isObject } from './utils'

export enum EmailApiOutcome {
  Success,
  Conflict,
  NotFound,
  UnknownError,
}


const isAxiosError = (err: unknown): err is AxiosError =>
  isObject(err) && !!err.isAxiosError


const getError = (error: AxiosError): string => {
  const maybeErrorMessage = error?.response?.data?.message

  return typeof maybeErrorMessage === 'string'
    ? maybeErrorMessage
    : ''
}


export const intoEmailApiOutcome = (err: unknown): EmailApiOutcome => {
  if (isAxiosError(err)) {
    if (err?.response?.status === 400 && getError(err).includes('Address already exists')) {
      return EmailApiOutcome.Conflict
    }

    if (err?.response?.status === 404) {
      return EmailApiOutcome.NotFound
    }

    console.error(`Unknown Axios error for Email API: ${err}`)
  }

  console.error(`Unknown Email API Issue: ${err}`)

  return EmailApiOutcome.UnknownError
}

