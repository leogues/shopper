import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'
import { isBase64 } from 'validator'

const SUPPORTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'webp']

export const isBase64Image = (value: any, args?: ValidationArguments) => {
  if (typeof value !== 'string') return false

  const prefixPattern = `^data:[^;]*\\/(${SUPPORTED_IMAGE_TYPES.join(
    '|'
  )});base64,`
  const regex = new RegExp(prefixPattern)

  const isValidPrefix = regex.test(value)
  if (!isValidPrefix) return false

  const base64String = value.replace(regex, '')
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
