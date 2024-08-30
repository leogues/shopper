import { Measure, MeasureType } from '../typeorm/entities/measure.entity'

export interface IMeasureRepository {
  existsMeasureForMonth(
    customerCode: string,
    measureType: MeasureType,
    date: Date
  ): Promise<boolean>

  findById(id: string): Promise<Measure | undefined>

  findAllByCustomerCode(
    customerCode: string,
    measureType?: MeasureType
  ): Promise<Measure[]>

  create(
    customerCode: string,
    imageId: string,
    measureValue: number,
    measureDatetime: Date,
    measureType: MeasureType
  ): Promise<Measure>

  update(measure: Measure): Promise<boolean>
}
