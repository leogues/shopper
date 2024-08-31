import * as Minio from 'minio'

export type FilePayload = {
  fileId: string
  mimeType: string
  buffer: Buffer
}

export type StorageConfig = {
  minio: Minio.ClientOptions
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
