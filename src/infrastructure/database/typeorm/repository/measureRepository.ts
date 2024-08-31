import { Between, DataSource, Repository } from 'typeorm'
import { IMeasureRepository } from '../../repository/measure'
import { Measure, MeasureType } from '../entities/measure.entity'

export class MeasureRepository implements IMeasureRepository {
  private readonly measureRepository: Repository<Measure>

  constructor(dataSource: DataSource) {
    this.measureRepository = dataSource.getRepository(Measure)
  }

  existsMeasureForMonth(
    customerCode: string,
    measureType: MeasureType,
    date: Date
  ): Promise<boolean> {
    const startOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
      0,
      0,
      0
    )
    const endOfMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59
    )

    return this.measureRepository.existsBy({
      customerCode,
      measureType,
      measureDatetime: Between(startOfMonth, endOfMonth),
    })
  }

  findAllByCustomerCode(
    customerCode: string,
    measureType?: MeasureType
  ): Promise<Measure[]> {
    return this.measureRepository.find({
      where: { customerCode, measureType },
      relations: ['image'],
    })
  }

  findById(id: string): Promise<Measure | undefined> {
    return this.measureRepository.findOne({
      where: { id },
      relations: ['image'],
    })
  }

  create(
    customerCode: string,
    imageId: string,
    measureValue: number,
    measureDatetime: Date,
    measureType: MeasureType
  ): Promise<Measure> {
    const measure = this.measureRepository.create({
      customerCode,
      imageId,
      measureValue,
      measureDatetime,
      measureType,
    })

    return this.measureRepository.save(measure)
  }

  async update(measure: Measure): Promise<boolean> {
    const { id, ...rest } = measure
    const updateResult = await this.measureRepository.update(measure.id, {
      ...rest,
    })
    return updateResult.affected > 0
  }
}
