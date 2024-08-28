import { plainToClass } from 'class-transformer'
import express, { NextFunction, Request, Response } from 'express'
import { UploadDTO } from './DTO/uploadDTO'

const routes = express.Router()

routes.post(
  '/upload',
  async (req: Request, res: Response, next: NextFunction) => {
    const uploadDTO = plainToClass(UploadDTO, req.body)
    const error = await uploadDTO.validate()

    if (error) return next(error)

    return res.json(uploadDTO)
  }
)

export default routes
