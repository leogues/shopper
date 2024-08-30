import { Errors, IError } from '../errors'
import { ICustomerRepository } from '../infrastructure/database/repository/customer'
import { IMeasureRepository } from '../infrastructure/database/repository/measure'
import { promptText } from '../infrastructure/LLM/gemini/promptText'
import { ModelIA, PromptManager } from '../infrastructure/LLM/LLM'
import {
  FilePayload,
  Storage,
  TempStorage,
} from '../infrastructure/storage/storage'
import { sharpImageWithText } from '../utils/sharpImage'

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// const fileManager = new GoogleAIFileManager(GEMINI_API_KEY)

type UploadMeasureInput = {
  image: Omit<FilePayload, 'fileId'>
  customer_code: string
  measure_datetime: Date
  measure_type: string
}

export class UploadMeasure {
  private readonly storage: Storage
  private readonly tempStorage: TempStorage
  private readonly promptManager: PromptManager
  private readonly modelIA: ModelIA
  private readonly customerRepository: ICustomerRepository
  private readonly measureRepository: IMeasureRepository

  constructor(
    storage: Storage,
    tempStorage: TempStorage,
    promptManager: PromptManager,
    modelIA: ModelIA,
    customerRepository: ICustomerRepository,
    measureRepository: IMeasureRepository
  ) {
    this.storage = storage
    this.tempStorage = tempStorage
    this.promptManager = promptManager
    this.modelIA = modelIA
    this.customerRepository = customerRepository
    this.measureRepository = measureRepository
  }

  async execute(input: UploadMeasureInput) {
    const { customer_code, measure_type, measure_datetime, image } = input

    const [_, exists] = await this.checkCustomerAndMeasure(
      customer_code,
      measure_type,
      measure_datetime
    )
    if (exists) {
      throw <IError>{
        code: Errors.EDUPLICATION,
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

    const [promptPayload, result] = await this.uploadWithPromptGeneration(
      tempImagePath,
      originalImage
    )

    if (promptPayload) this.tempStorage.delete(tempImagePath)

    const geminiResponse = await this.modelIA.executePrompt(promptPayload)

    return {
      tempImagePath,
      ...result,
      geminiResponse,
    }
  }

  private checkCustomerAndMeasure(
    customer_code: string,
    measure_type: string,
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

    const resultPromise = this.storage.upload(image)

    return Promise.all([promptPayloadPromise, resultPromise])
  }
}
