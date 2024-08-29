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
  private readonly client: Minio.Client
  private readonly minioEndPoint: string
  private readonly minioPort: number

  constructor(config: Minio.ClientOptions) {
    this.minioEndPoint = config.endPoint
    this.minioPort = config.port
    this.client = new Minio.Client(config)
  }

  async upload(file: Attachment): Promise<UploadedResult> {
    const fileId = crypto.randomUUID()
    await this.uploadToMinio(fileId, file)
    const presignedUrl = await this.getPresignedUrl(fileId)
    return { fileId, presignedUrl }
  }

  uploadToMinio(fileId: string, file: Attachment) {
    const { mimetype, buffer } = file
    return this.client.putObject(MINIO_BUCKET, fileId, buffer, buffer.length, {
      'Content-Type': mimetype,
    })
  }

  async getPresignedUrl(fileId: string) {
    return this.client.presignedGetObject(
      MINIO_BUCKET,
      fileId,
      PRESIGNED_URL_EXPIRY
    )
  }

  getAttachmentUrl(fileId: string) {
    return `${this.minioEndPoint}:${this.minioPort}/${MINIO_BUCKET}/${fileId}`
  }
}
