import { UploadDTO } from '../DTO/uploadDTO'
import { Errors, IError } from '../errors'
import { ICustomerRepository } from '../infrastructure/database/repository/customer'
import { IMeasureRepository } from '../infrastructure/database/repository/measure'
import { FilePayload, Storage } from '../infrastructure/storage/storage'
import { decodeBase64Image } from '../utils/base64ToImage'

export class UploadMeasure {
  private readonly storage: Storage
  private readonly customerRepository: ICustomerRepository
  private readonly measureRepository: IMeasureRepository

  constructor(
    storage: Storage,
    customerRepository: ICustomerRepository,
    measureRepository: IMeasureRepository
  ) {
    this.storage = storage
    this.customerRepository = customerRepository
    this.measureRepository = measureRepository
  }

  async execute(uploadDTO: UploadDTO) {
    const { customer_code, measure_type, measure_datetime, image } = uploadDTO

    const customerPromise =
      this.customerRepository.findByCodeOrCreate(customer_code)
    const existsMeasurePromise = this.measureRepository.existsMeasureForMonth(
      customer_code,
      measure_type,
      measure_datetime
    )
    const [customer, exists] = await Promise.all([
      customerPromise,
      existsMeasurePromise,
    ])

    if (exists) {
      throw <IError>{
        code: Errors.EDUPLICATION,
        message: 'Leitura do mês já realizada',
      }
    }

    const { data, mimeType } = decodeBase64Image(image)

    const file: FilePayload = {
      buffer: data,
      mimetype: mimeType,
    }

    const result = await this.storage.upload(file)

    const permanentUrl = this.storage.getPermanentFileUrl(result.fileId)

    return { ...result, permanentUrl, customer, exists }
  }
}
