import { validate, ValidationError, ValidatorOptions } from 'class-validator'
import { Errors, IError } from '../errors'

function formatValidationErrors(errors: ValidationError[]): string {
  const errorMessages: string[] = []

  errors.forEach((error) => {
    if (error.constraints) {
      const messages = Object.values(error.constraints).join(', ')
      errorMessages.push(`${error.property}: ${messages}`)
    }
    if (error.children.length > 0) {
      const childErrors = formatValidationErrors(error.children)
      errorMessages.push(childErrors)
    }
  })

  return errorMessages.join('; ')
}
export const validateFormated = async (
  object: Object,
  validatorOptions?: ValidatorOptions
) => {
  const errors = await validate(object, {
    whitelist: true,
    stopAtFirstError: true,

    ...validatorOptions,
  })

  if (errors.length)
    return <IError>{
      code: Errors.EINVALID,
      message: formatValidationErrors(errors),
    }

  return null
}
