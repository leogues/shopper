export type IError = {
  prefixCode?: string
  code: Errors
  message: string
}

export enum Errors {
  EINVALID = 'INVALID_DATA',
  ENOTFOUND = 'NOT_FOUND',
  EDUPLICATION = 'DUPLICATE',
  EINTERNAL = 'INTERNAL_ERROR',
}

export const HTTPErrors = {
  [Errors.EINVALID]: 400,
  [Errors.ENOTFOUND]: 404,
  [Errors.EDUPLICATION]: 409,
  [Errors.EINTERNAL]: 500,
}

export const errorf = (error: IError) => {
  return {
    error_code: error.prefixCode
      ? `${error.prefixCode}_${error.code}`
      : error.code,
    error_description: error.message,
  }
}
