export type Attachment = {
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
