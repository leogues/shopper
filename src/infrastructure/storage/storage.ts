export type FilePayload = {
  fileId: string
  mimeType: string
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
  fileName: string
  presignedUrl: string
}

export interface Storage {
  upload(file: FilePayload): Promise<UploadedResult>
  getPermanentFileUrl(fileId: string): string
}

export interface TempStorage {
  write(file: FilePayload): Promise<string>
  delete(fileName: string): Promise<void>
}
