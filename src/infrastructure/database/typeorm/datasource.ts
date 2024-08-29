import { config } from 'dotenv'
import { DataSource } from 'typeorm'
import { Customer } from './entities/customer.entity'
import { Image } from './entities/image.entity'
import { Measure } from './entities/measure.entity'
config()

const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://root:root@localhost:5433/shopper'

export const dataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  synchronize: true,
  entities: [Measure, Customer, Image],
  migrations: [],
  logging: false,
})

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err)
  })
