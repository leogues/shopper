import { NextFunction, Request, Response } from 'express'
import { errorf, Errors, HTTPErrors, IError } from '../errors'

export const errorMiddleware = (
  err: IError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error) {
    console.error({
      message: err.message,
      stack: err.stack,
    })
    return res.status(HTTPErrors[Errors.EINTERNAL]).json({
      error_code: Errors.EINTERNAL,
      error_description: 'Internal server error',
    })
  }

  const { code, message, prefixCode } = err

  const httpCode = HTTPErrors[code] || 500

  if (!code) {
    next()
  }

  if (httpCode === HTTPErrors[Errors.EINTERNAL]) {
    console.error(message)
    return res.status(httpCode).json({
      error_code: Errors.EINTERNAL,
      error_description: 'Internal server error',
    })
  }

  return res.status(httpCode).json(errorf({ code, message, prefixCode }))
}
