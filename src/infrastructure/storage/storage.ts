export type FilePayload = {
  mimetype: string
  buffer: Buffer
}

export type StorageConfig = {
  minio: {
    endPoint: string
    port: number
    useSSL: boolean
    accessKey: string
    secretKey: string
  }
}

export type UploadedResult = {
  fileId: string
  presignedUrl: string
}

export interface Storage {
  upload(file: FilePayload): Promise<UploadedResult>
  getPermanentFileUrl(fileId: string): string
}
