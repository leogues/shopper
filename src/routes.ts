import { plainToClass } from 'class-transformer'
import express, { NextFunction, Request, Response } from 'express'
import { UploadDTO } from './DTO/uploadDTO'
import { dataSource } from './infrastructure/database/typeorm/datasource'
import { CustomerRepository } from './infrastructure/database/typeorm/repository/customerRepository'
import { MeasureRepository } from './infrastructure/database/typeorm/repository/measureRepository'
import { loadStorageConfig } from './infrastructure/storage/config'
import { MinioStorage } from './infrastructure/storage/minio/minio'
import { UploadMeasure } from './useCase/uploadMeasure'

const routes = express.Router()

const storageConfig = loadStorageConfig()

const storage = new MinioStorage(storageConfig.minio)

const costumerRepository = new CustomerRepository(dataSource)
const measureRepository = new MeasureRepository(dataSource)

const uploadMeasure = new UploadMeasure(
  storage,
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
      const foo = await uploadMeasure.execute(uploadDTO)

      return res.json(foo)
    } catch (error) {
      return next(error)
    }
  }
)

export default routes
