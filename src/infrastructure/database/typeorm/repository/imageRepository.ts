import { DataSource, Repository } from 'typeorm'
import { IImageRepository } from '../../repository/image'
import { Image } from '../entities/image.entity'

export class ImageRepository implements IImageRepository {
  private readonly imageRepository: Repository<Image>

  constructor(dataSource: DataSource) {
    this.imageRepository = dataSource.getRepository(Image)
  }

  async update(image: Image): Promise<boolean> {
    const { id, ...rest } = image

    const updateResult = await this.imageRepository.update(image.id, {
      ...rest,
    })
    return updateResult.affected > 0
  }

  create(id: string, imageName: string, imageUrl: string): Promise<Image> {
    const image = this.imageRepository.create({ id, imageName, imageUrl })

    return this.imageRepository.save(image)
  }
}
