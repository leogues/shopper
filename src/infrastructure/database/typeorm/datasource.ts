import { config } from 'dotenv'
import { DataSource } from 'typeorm'
config()

const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://root:root@localhost:5433/shopper'

const dataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  synchronize: true,
  entities: [],
  migrations: [],
})

export default dataSource
