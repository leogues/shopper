import { Errors, IError } from '../errors'
import { IImageRepository } from '../infrastructure/database/repository/image'
import { IMeasureRepository } from '../infrastructure/database/repository/measure'
import { Storage } from '../infrastructure/storage/storage'

export type ConfirmMeasureInput = {
  measureUuid: string
  confirmedValue: number
}

export type Output = {
  success: boolean
}

export class ConfirmMeasure {
  private readonly storage: Storage
  private readonly measureRepository: IMeasureRepository
  private readonly imageRepository: IImageRepository

  constructor(
    storage: Storage,
    measureRepository: IMeasureRepository,
    imageRepository: IImageRepository
  ) {
    this.storage = storage
    this.measureRepository = measureRepository
    this.imageRepository = imageRepository
  }

  async execute(input: ConfirmMeasureInput): Promise<Output> {
    const { measureUuid, confirmedValue } = input

    const measure = await this.measureRepository.findById(measureUuid)

    if (!measure) {
      throw <IError>{
        prefixCode: 'MEASURE',
        code: Errors.ENOTFOUND,
        message: 'Leitura do mês já realizada',
      }
    }

    if (measure.hasConfirmed) {
      throw <IError>{
        prefixCode: 'CONFIRMATION',
        code: Errors.EDUPLICATION,
        message: 'Leitura do mês já realizada',
      }
    }

    let image = measure.image

    image.imageUrl = this.storage.getPermanentFileUrl(image.imageName)

    measure.measureValue = confirmedValue
    measure.hasConfirmed = true

    await Promise.all([
      this.measureRepository.update(measure),
      this.imageRepository.update(image),
    ])

    return {
      success: true,
    }
  }
}
