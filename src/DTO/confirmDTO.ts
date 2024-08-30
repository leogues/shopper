import { IsInt, IsString } from 'class-validator'
import { validateFormated } from '../validate/validateFormated'

export class ConfirmDTO {
  @IsString({ message: 'measure uuid must be a string' })
  measure_uuid: string

  @IsInt({ message: 'measure value must be a number' })
  confirmed_value: number

  validate() {
    return validateFormated(this)
  }
}
