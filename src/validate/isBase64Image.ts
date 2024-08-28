import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'
import { isBase64 } from 'validator'

const SUPPORTED_IMAGE_TYPES = ['jpeg', 'png', 'gif', 'webp']

const isBase64Image = (value: any, args: ValidationArguments) => {
  if (typeof value !== 'string') return false

  const prefixPattern = `^data:image\\/(${SUPPORTED_IMAGE_TYPES.join(
    '|'
  )});base64,`

  const isValidPrefix = new RegExp(prefixPattern).test(value)
  if (!isValidPrefix) return false

  const base64String = value.replace(new RegExp(prefixPattern), '')
  return isBase64(base64String)
}

export function IsBase64Image(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBase64Image',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: function (value: any, args: ValidationArguments) {
          return isBase64Image(value, args)
        },
        defaultMessage(args: ValidationArguments) {
          return 'Invalid base64 image string'
        },
      },
    })
  }
}
