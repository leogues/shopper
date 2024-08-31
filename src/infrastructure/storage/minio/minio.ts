import { config } from 'dotenv'
import * as Minio from 'minio'
import { FilePayload, Storage, UploadedResult } from '../storage'
import { StartMinio } from './startMinio'
config()

const MINIO_BUCKET = 'shopper'
const PRESIGNED_URL_EXPIRY = 24 * 60 * 60 // 24 hours

export class MinioStorage implements Storage {
  private readonly client: Minio.Client
  private readonly minioEndPoint: string
  private readonly minioPort: number

  constructor(config: Minio.ClientOptions) {
    this.minioEndPoint = config.endPoint
    this.minioPort = config.port
    this.client = new Minio.Client(config)
    const startMinio = new StartMinio(MINIO_BUCKET, this.client)

    startMinio.start().catch((error) => {
      console.error('Erro ao iniciar o Minio.', error)
    })
  }

  private extractFileExtension(mimeType: string): string {
    return mimeType.split('/')[1] || ''
  }

  async upload(file: FilePayload): Promise<UploadedResult> {
    const fileExtension = this.extractFileExtension(file.mimeType)
    const fileName = `${file.fileId}.${fileExtension}`
    await this.uploadToMinio(fileName, file)
    const presignedUrl = await this.getPresignedUrl(fileName)
    return { fileId: file.fileId, fileName, presignedUrl }
  }

  uploadToMinio(fileName: string, file: FilePayload) {
    const { mimeType, buffer } = file
    return this.client.putObject(
      MINIO_BUCKET,
      fileName,
      buffer,
      buffer.length,
      {
        'Content-Type': mimeType,
      }
    )
  }

  getPresignedUrl(fileId: string) {
    return this.client.presignedGetObject(
      MINIO_BUCKET,
      fileId,
      PRESIGNED_URL_EXPIRY
    )
  }

  getPermanentFileUrl(fileId: string) {
    return `${this.minioEndPoint}:${this.minioPort}/${MINIO_BUCKET}/${fileId}`
  }
}
