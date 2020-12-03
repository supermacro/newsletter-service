import { AxiosError } from 'axios'
import { isObject } from './utils'

export enum EmailApiOutcome {
  Success,
  Conflict,
  UnknownError,
}


const isAxiosError = (err: unknown): err is AxiosError =>
  isObject(err) && !!err.isAxiosError


export const intoEmailApiOutcome = (err: unknown): EmailApiOutcome => {
  if (isAxiosError(err)) {
    if (err?.response?.status === 400) {
      return EmailApiOutcome.Conflict
    }

    console.error(`Unknown Axios error for Email API: ${err}`)
  }

  console.error(`Unknown Email API Issue: ${err}`)

  return EmailApiOutcome.UnknownError
}
