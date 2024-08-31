import { DatabaseConfig } from './database'
import { Customer } from './typeorm/entities/customer.entity'
import { Image } from './typeorm/entities/image.entity'
import { Measure } from './typeorm/entities/measure.entity'

export const loadDatabaseConfig = (): DatabaseConfig => {
  return {
    postgres: {
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://root:root@db:5432/shopper',
      synchronize: true,
      entities: [Measure, Customer, Image],
      migrations: [],
      logging: false,
    },
  }
}
