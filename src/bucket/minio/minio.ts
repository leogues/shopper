import { config } from 'dotenv'
import * as Minio from 'minio'
config()

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'localhost'
const MINIO_PORT = parseInt(process.env.MINIO_PORT || '9000')
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS || 'root'
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'root123'

const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: MINIO_PORT,
  useSSL: false,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
})

export default minioClient
