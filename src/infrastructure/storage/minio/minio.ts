import { config } from 'dotenv'
import * as Minio from 'minio'
import { Attachment } from '../type'
config()

type UploadedResult = {
  fileId: string
  presignedUrl: string
}

const MINIO_BUCKET = 'shopper'
const PRESIGNED_URL_EXPIRY = 24 * 60 * 60 // 24 hours

export class MinioStorage {
  private readonly minioClient: Minio.Client

  constructor(config: Minio.ClientOptions) {
    this.minioClient = new Minio.Client(config)
  }

  async upload(file: Attachment): Promise<UploadedResult> {
    const fileId = crypto.randomUUID()
    await this.uploadToMinio(fileId, file)
    const presignedUrl = await this.getPresignedUrl(fileId)
    return { fileId, presignedUrl }
  }

  uploadToMinio(fileId: string, file: Attachment) {
    const { mimetype, buffer } = file
    return this.minioClient.putObject(
      MINIO_BUCKET,
      fileId,
      buffer,
      buffer.length,
      {
        'Content-Type': mimetype,
      }
    )
  }

  async getPresignedUrl(fileId: string) {
    return this.minioClient.presignedGetObject(
      MINIO_BUCKET,
      fileId,
      PRESIGNED_URL_EXPIRY
    )
  }
}
