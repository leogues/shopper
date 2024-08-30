import { Image } from '../typeorm/entities/image.entity'

export interface IImageRepository {
  create(id: string, imageName: string, imageUrl: string): Promise<Image>
  update(image: Image): Promise<boolean>
}
