import { StorageConfig } from './storage'

export const loadStorageConfig = (): StorageConfig => {
  return {
    minio: {
      endPoint: process.env.MINIO_ENDPOINT || 'bucket.leogues.com.br',
      useSSL: true,
      accessKey: process.env.MINIO_ACCESS_KEY || 'root',
      secretKey: process.env.MINIO_SECRET_KEY || 'root1234',
    },
  }
}
