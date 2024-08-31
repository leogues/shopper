import { IsInt, IsUUID } from 'class-validator'
import { validateFormated } from '../validate/validateFormated'

export class ConfirmDTO {
  @IsUUID(4, { message: 'measure uuid must be a UUID' })
  measure_uuid: string

  @IsInt({ message: 'measure value must be a number' })
  confirmed_value: number

  validate() {
    return validateFormated(this)
  }
}
