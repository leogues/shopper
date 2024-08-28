import { Transform } from 'class-transformer'
import { IsDate, IsEnum, IsString } from 'class-validator'
import { IsBase64Image } from '../validate/isBase64Image'
import { validateFormated } from '../validate/validateFormated'

export class UploadDTO {
  @IsBase64Image({ message: 'image must be a base64 string' })
  image: string

  @IsString({ message: 'customer code must be a string' })
  customer_code: string

  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'measure datetime must be a date' })
  measure_datetime: Date

  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(['water', 'gas'], { message: 'measure type must be water or gas' })
  measure_type: 'water' | 'gas'

  validate() {
    return validateFormated(this)
  }
}
