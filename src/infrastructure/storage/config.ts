import { StorageConfig } from './storage'

export const loadStorageConfig = (): StorageConfig => {
  return {
    minio: {
      endPoint: process.env.MINIO_ENDPOINT || 'minio',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'false',
      accessKey: process.env.MINIO_ACCESS_KEY || 'root',
      secretKey: process.env.MINIO_SECRET_KEY || 'root1234',
    },
  }
}
