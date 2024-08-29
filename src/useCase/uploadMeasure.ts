import { UploadDTO } from '../DTO/uploadDTO'
import { FilePayload, Storage } from '../infrastructure/storage/storage'
import { decodeBase64Image } from '../utils/base64ToImage'

export class UploadMeasure {
  private readonly storage: Storage

  constructor(storage: Storage) {
    this.storage = storage
  }

  async execute(uploadDTO: UploadDTO) {
    const { data, mimeType } = decodeBase64Image(uploadDTO.image)

    const file: FilePayload = {
      buffer: data,
      mimetype: mimeType,
    }

    const result = await this.storage.upload(file)

    const permanentUrl = this.storage.getPermanentFileUrl(result.fileId)

    return { ...result, permanentUrl }
  }
}
