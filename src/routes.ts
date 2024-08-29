import { plainToClass } from 'class-transformer'
import express, { NextFunction, Request, Response } from 'express'
import { UploadDTO } from './DTO/uploadDTO'
import { dataSource } from './infrastructure/database/typeorm/datasource'
import { CustomerRepository } from './infrastructure/database/typeorm/repository/customerRepository'
import { MeasureRepository } from './infrastructure/database/typeorm/repository/measureRepository'
import { loadStorageConfig } from './infrastructure/storage/config'
import { TempFileStorage } from './infrastructure/storage/fileSystem/tempStorage'
import { MinioStorage } from './infrastructure/storage/minio/minio'
import { UploadMeasure } from './useCase/uploadMeasure'
import { decodeBase64Image } from './utils/base64ToImage'

const routes = express.Router()

const storageConfig = loadStorageConfig()

const storage = new MinioStorage(storageConfig.minio)
const tempStorage = new TempFileStorage()

const costumerRepository = new CustomerRepository(dataSource)
const measureRepository = new MeasureRepository(dataSource)

const uploadMeasure = new UploadMeasure(
  storage,
  tempStorage,
  costumerRepository,
  measureRepository
)

routes.post(
  '/upload',
  async (req: Request, res: Response, next: NextFunction) => {
    const uploadDTO = plainToClass(UploadDTO, req.body)
    const error = await uploadDTO.validate()

    if (error) return next(error)

    try {
      const { data, mimeType } = decodeBase64Image(uploadDTO.image)
      const { customer_code, measure_datetime, measure_type } = uploadDTO

      const foo = await uploadMeasure.execute({
        image: { buffer: data, mimeType },
        customer_code: customer_code,
        measure_datetime: measure_datetime,
        measure_type: measure_type,
      })

      return res.json(foo)
    } catch (error) {
      return next(error)
    }
  }
)

export default routes
