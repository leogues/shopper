import { GoogleAIFileManager } from '@google/generative-ai/server'
import { config } from 'dotenv'
import { Errors, IError } from '../errors'
import { ICustomerRepository } from '../infrastructure/database/repository/customer'
import { IMeasureRepository } from '../infrastructure/database/repository/measure'
import {
  FilePayload,
  Storage,
  TempStorage,
} from '../infrastructure/storage/storage'

config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const fileManager = new GoogleAIFileManager(GEMINI_API_KEY)

type UploadMeasureInput = {
  image: FilePayload
  customer_code: string
  measure_datetime: Date
  measure_type: string
}

export class UploadMeasure {
  private readonly storage: Storage
  private readonly tempStorage: TempStorage
  private readonly customerRepository: ICustomerRepository
  private readonly measureRepository: IMeasureRepository

  constructor(
    storage: Storage,
    tempStorage: TempStorage,
    customerRepository: ICustomerRepository,
    measureRepository: IMeasureRepository
  ) {
    this.storage = storage
    this.tempStorage = tempStorage
    this.customerRepository = customerRepository
    this.measureRepository = measureRepository
  }

  async execute(input: UploadMeasureInput) {
    const { customer_code, measure_type, measure_datetime, image } = input

    const customerPromise =
      this.customerRepository.findByCodeOrCreate(customer_code)

    const existsMeasurePromise = this.measureRepository.existsMeasureForMonth(
      customer_code,
      measure_type,
      measure_datetime
    )
    const [customer, exists] = await Promise.all([
      customerPromise,
      existsMeasurePromise,
    ])

    if (exists) {
      throw <IError>{
        code: Errors.EDUPLICATION,
        message: 'Leitura do mês já realizada',
      }
    }

    const tempImagePath = await this.tempStorage.write(
      image.buffer,
      image.mimeType
    )
    const uploadIAFileManagerPromise = fileManager.uploadFile(tempImagePath, {
      mimeType: image.mimeType,
    })

    const resultPromise = await this.storage.upload(image)

    const [uploadIAFileManager, result] = await Promise.all([
      uploadIAFileManagerPromise,
      resultPromise,
    ])

    if (uploadIAFileManager) this.tempStorage.delete(tempImagePath)

    const permanentUrl = this.storage.getPermanentFileUrl(result.fileId)

    return { ...result, uploadIAFileManager, permanentUrl, customer, exists }
  }
}
