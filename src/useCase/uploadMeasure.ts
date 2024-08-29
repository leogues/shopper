import { UploadDTO } from '../DTO/uploadDTO'
import { ICustomerRepository } from '../infrastructure/database/repository/customer'
import { FilePayload, Storage } from '../infrastructure/storage/storage'
import { decodeBase64Image } from '../utils/base64ToImage'

export class UploadMeasure {
  private readonly storage: Storage
  private readonly customerRepository: ICustomerRepository

  constructor(storage: Storage, customerRepository: ICustomerRepository) {
    this.storage = storage
    this.customerRepository = customerRepository
  }

  async execute(uploadDTO: UploadDTO) {
    const { customer_code, image } = uploadDTO

    const customer = await this.customerRepository.findByCodeOrCreate(
      customer_code
    )

    const { data, mimeType } = decodeBase64Image(image)

    const file: FilePayload = {
      buffer: data,
      mimetype: mimeType,
    }

    const result = await this.storage.upload(file)

    const permanentUrl = this.storage.getPermanentFileUrl(result.fileId)

    return { ...result, permanentUrl, customer }
  }
}
