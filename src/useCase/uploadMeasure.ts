import { Errors, IError } from '../errors'
import { ICustomerRepository } from '../infrastructure/database/repository/customer'
import { IImageRepository } from '../infrastructure/database/repository/image'
import { IMeasureRepository } from '../infrastructure/database/repository/measure'
import { MeasureType } from '../infrastructure/database/typeorm/entities/measure.entity'
import { promptText } from '../infrastructure/LLM/gemini/promptText'
import { ModelIA, PromptManager } from '../infrastructure/LLM/LLM'
import {
  FilePayload,
  Storage,
  TempStorage,
} from '../infrastructure/storage/storage'
import { extractNumbers } from '../utils/extractNumberToText'
import { sharpImageWithText } from '../utils/sharpImage'

type UploadMeasureInput = {
  image: Omit<FilePayload, 'fileId'>
  customer_code: string
  measure_datetime: Date
  measure_type: MeasureType
}

type Output = {
  image_url: string
  measure_value: number
  measure_uuid: string
}

export class UploadMeasure {
  private readonly storage: Storage
  private readonly tempStorage: TempStorage
  private readonly promptManager: PromptManager
  private readonly modelIA: ModelIA
  private readonly customerRepository: ICustomerRepository
  private readonly measureRepository: IMeasureRepository
  private readonly imageRepository: IImageRepository

  constructor(
    storage: Storage,
    tempStorage: TempStorage,
    promptManager: PromptManager,
    modelIA: ModelIA,
    customerRepository: ICustomerRepository,
    measureRepository: IMeasureRepository,
    imageRepository: IImageRepository
  ) {
    this.storage = storage
    this.tempStorage = tempStorage
    this.promptManager = promptManager
    this.modelIA = modelIA
    this.customerRepository = customerRepository
    this.measureRepository = measureRepository
    this.imageRepository = imageRepository
  }

  async execute(input: UploadMeasureInput): Promise<Output> {
    const { customer_code, measure_type, measure_datetime, image } = input

    const [_, exists] = await this.checkCustomerAndMeasure(
      customer_code,
      measure_type,
      measure_datetime
    )
    if (exists) {
      throw <IError>{
        code: Errors.EDOUBLEREPORT,
        message: 'Leitura do mês já realizada',
      }
    }

    const fileId = crypto.randomUUID()

    const processedImageBuffer = await sharpImageWithText(image.buffer)

    const originalImage: FilePayload = {
      fileId: fileId,
      buffer: image.buffer,
      mimeType: image.mimeType,
    }

    const processedImage: FilePayload = {
      fileId: fileId,
      buffer: processedImageBuffer,
      mimeType: image.mimeType,
    }

    const tempImagePath = await this.tempStorage.write(processedImage)

    const [promptPayload, uploadResult] = await this.uploadWithPromptGeneration(
      tempImagePath,
      originalImage
    )

    if (promptPayload) this.tempStorage.delete(tempImagePath)

    const modelMeterReadingTextResponse = await this.modelIA.executePrompt(
      promptPayload
    )

    const meterReadingValues = extractNumbers(modelMeterReadingTextResponse)[0]

    if (!meterReadingValues) throw Error(modelMeterReadingTextResponse)

    const savedImage = await this.imageRepository.create(
      fileId,
      uploadResult.fileName,
      uploadResult.presignedUrl
    )

    const measure = await this.measureRepository.create(
      customer_code,
      savedImage.id,
      meterReadingValues,
      measure_datetime,
      measure_type
    )

    return {
      image_url: savedImage.imageUrl,
      measure_value: measure.measureValue,
      measure_uuid: measure.id,
    }
  }

  private checkCustomerAndMeasure(
    customer_code: string,
    measure_type: MeasureType,
    measure_datetime: Date
  ) {
    const customerPromise =
      this.customerRepository.findByCodeOrCreate(customer_code)
    const existsMeasurePromise = this.measureRepository.existsMeasureForMonth(
      customer_code,
      measure_type,
      measure_datetime
    )

    return Promise.all([customerPromise, existsMeasurePromise])
  }

  private uploadWithPromptGeneration(imagePath: string, image: FilePayload) {
    const promptPayloadPromise = this.promptManager.createPromptPayload(
      promptText.extractMeterValues,
      {
        filePath: imagePath,
        mimeType: image.mimeType,
      }
    )

    const storageResult = this.storage.upload(image)

    return Promise.all([promptPayloadPromise, storageResult])
  }
}
