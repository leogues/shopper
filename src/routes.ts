import { config } from 'dotenv'
import express from 'express'
import { MeasureController } from './controller/MeasureController'
import { dataSource } from './infrastructure/database/typeorm/datasource'
import { CustomerRepository } from './infrastructure/database/typeorm/repository/customerRepository'
import { ImageRepository } from './infrastructure/database/typeorm/repository/imageRepository'
import { MeasureRepository } from './infrastructure/database/typeorm/repository/measureRepository'
import { GeminiIA } from './infrastructure/LLM/gemini/gemini'
import { GeminiFileManager } from './infrastructure/LLM/gemini/geminiFileManger'
import { GeminiPromptManager } from './infrastructure/LLM/gemini/geminiPromptManager'
import { loadStorageConfig } from './infrastructure/storage/config'
import { TempFileStorage } from './infrastructure/storage/fileSystem/tempStorage'
import { MinioStorage } from './infrastructure/storage/minio/minio'
import { ConfirmMeasure } from './useCase/confirmMeasure'
import { ListCustomerMeasure } from './useCase/listCustomerMeasure'
import { UploadMeasure } from './useCase/uploadMeasure'
config()

const routes = express.Router()

const storageConfig = loadStorageConfig()

const storage = new MinioStorage(storageConfig.minio)
const tempStorage = new TempFileStorage()
const IAFileManager = new GeminiFileManager(process.env.GEMINI_API_KEY)

const promptManager = new GeminiPromptManager(IAFileManager)
const modelIA = new GeminiIA(process.env.GEMINI_API_KEY)

const costumerRepository = new CustomerRepository(dataSource)
const measureRepository = new MeasureRepository(dataSource)
const imageRepository = new ImageRepository(dataSource)

const uploadMeasure = new UploadMeasure(
  storage,
  tempStorage,
  promptManager,
  modelIA,
  costumerRepository,
  measureRepository,
  imageRepository
)
const updateMeasure = new ConfirmMeasure(
  storage,
  measureRepository,
  imageRepository
)
const listCustomerMeasures = new ListCustomerMeasure(measureRepository)

const measureController = new MeasureController(
  uploadMeasure,
  updateMeasure,
  listCustomerMeasures
)

routes.post('/upload', measureController.upload)
routes.patch('/confirm', measureController.confirm)
routes.get('/:customer_code/list', measureController.list)

export default routes
