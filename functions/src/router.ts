import { Request, Response } from 'express'

export type HandlerResult
  = 'failed'
  | 'succeed'
  | 'not_found'
  | 'conflict'


type ReqQuery = Request['query']

export type Validator<T> = (requestBody: Record<string, unknown | undefined>) => T | null

type Handler<T> = (data: T, queryParams?: ReqQuery) => Promise<HandlerResult>

const HttpStatusCodeMap: Record<HandlerResult, number> = {
  failed: 500,
  conflict: 409,
  not_found: 404,
  succeed: 200,
}

export const createRoute = <T>(validator: Validator<T>, handler: Handler<T>) => {
  return async (req: Request, res: Response) => {
    const validatioResult = validator(req.body)


    if (!validatioResult) {
      res.sendStatus(400)
      return 
    }

    const handlerResult = await handler(validatioResult, req.query)

    const code = HttpStatusCodeMap[handlerResult]

    res.sendStatus(code) 
  }
}

