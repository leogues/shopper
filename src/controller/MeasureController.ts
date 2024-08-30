import { plainToClass } from 'class-transformer'
import { NextFunction, Request, Response } from 'express'
import { ConfirmDTO } from '../DTO/confirmDTO'
import { UploadDTO } from '../DTO/uploadDTO'
import { ConfirmMeasure } from '../useCase/confirmMeasure'
import { ListCustomerMeasure } from '../useCase/listCustomerMeasure'
import { UploadMeasure } from '../useCase/uploadMeasure'
import { decodeBase64Image } from '../utils/base64ToImage'

export class MeasureController {
  private readonly uploadMeasure: UploadMeasure
  private readonly updateMeasure: ConfirmMeasure
  private readonly listCustomerMeasures: ListCustomerMeasure

  constructor(
    uploadMeasure: UploadMeasure,
    updateMeasure: ConfirmMeasure,
    listCustomerMeasures: ListCustomerMeasure
  ) {
    this.uploadMeasure = uploadMeasure
    this.updateMeasure = updateMeasure
    this.listCustomerMeasures = listCustomerMeasures
  }

  upload = async (req: Request, res: Response, next: NextFunction) => {
    const uploadDTO = plainToClass(UploadDTO, req.body)
    const error = await uploadDTO.validate()

    if (error) return next(error)

    try {
      const { data, mimeType } = decodeBase64Image(uploadDTO.image)
      const { customer_code, measure_datetime, measure_type } = uploadDTO

      const output = await this.uploadMeasure.execute({
        image: { buffer: data, mimeType },
        customer_code: customer_code,
        measure_datetime: measure_datetime,
        measure_type: measure_type,
      })

      return res.json(output)
    } catch (error) {
      return next(error)
    }
  }

  confirm = async (req: Request, res: Response, next: NextFunction) => {
    const confirmDTO = plainToClass(ConfirmDTO, req.body)
    const error = await confirmDTO.validate()

    if (error) return next(error)

    try {
      const { measure_uuid, confirmed_value } = confirmDTO
      const output = await this.updateMeasure.execute({
        measureUuid: measure_uuid,
        confirmedValue: confirmed_value,
      })

      return res.json(output)
    } catch (error) {
      return next(error)
    }
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    const { customer_code } = req.params
    const { measure_type } = req.query

    try {
      const measureType = measure_type
        ? measure_type?.toString().toUpperCase()
        : undefined

      const output = await this.listCustomerMeasures.execute({
        customerCode: customer_code,
        measureType,
      })

      return res.json(output)
    } catch (error) {
      return next(error)
    }
  }
}
