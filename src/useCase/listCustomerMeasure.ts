import { Errors, IError } from '../errors'
import { IMeasureRepository } from '../infrastructure/database/repository/measure'
import {
  MeasureType,
  measureTypes,
  SupportedMeasureType,
} from '../infrastructure/database/typeorm/entities/measure.entity'

type ListCustomerMeasureInput = {
  customerCode: string
  measureType: string | undefined
}

type Measure = {
  measure_uuid: string
  measure_datetime: Date
  measure_type: MeasureType
  has_confirmed: boolean
  image_url: string
}

type Output = {
  customer_code: string
  measures: Measure[]
}

export class ListCustomerMeasure {
  constructor(private measureRepository: IMeasureRepository) {}

  async execute(input: ListCustomerMeasureInput): Promise<Output> {
    const { customerCode, measureType } = input

    if (
      measureType &&
      !measureTypes.includes(measureType as SupportedMeasureType)
    ) {
      throw <IError>{
        code: Errors.EINVALIDTYPE,
        message: 'Tipo de medição não permitida',
      }
    }

    const measures = await this.measureRepository.findAllByCustomerCode(
      customerCode,
      measureType as MeasureType
    )

    if (!measures.length) {
      throw <IError>{
        prefixCode: 'MEASURE',
        code: Errors.ENOTFOUND,
        message: '"Nenhuma leitura encontrada',
      }
    }

    return {
      customer_code: customerCode,
      measures: measures.map((measure) => ({
        measure_uuid: measure.id,
        measure_datetime: measure.measureDatetime,
        measure_type: measure.measureType,
        has_confirmed: measure.hasConfirmed,
        image_url: measure.image.imageUrl,
      })),
    }
  }
}
