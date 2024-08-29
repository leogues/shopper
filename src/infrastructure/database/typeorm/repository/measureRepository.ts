import { Between, DataSource, Repository } from 'typeorm'
import { IMeasureRepository } from '../../repository/measure'
import { Measure, MeasureType } from '../entities/measure.entity'

export class MeasureRepository implements IMeasureRepository {
  private readonly measureRepository: Repository<Measure>

  constructor(dataSource: DataSource) {
    this.measureRepository = dataSource.getRepository(Measure)
  }

  async existsMeasureForMonth(
    customerCode: string,
    measureType: MeasureType,
    date: Date
  ): Promise<boolean> {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    return this.measureRepository.existsBy({
      customerCode,
      measureType,
      measureDatetime: Between(startOfMonth, endOfMonth),
    })
  }
}
