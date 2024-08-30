import { config } from 'dotenv'
import { DataSource } from 'typeorm'
import { loadDatabaseConfig } from '../config'
config()

const DatabaseConfig = loadDatabaseConfig()

export const dataSource = new DataSource(DatabaseConfig.postgres)

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err)
  })
