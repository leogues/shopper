import express from 'express'
import dataSource from './infrastructure/database/typeorm/datasource'
import { errorMiddleware } from './middleware/errorMiddleware'
import routes from './routes'

const app = express()

dataSource.driver.connect().then(() => {
  console.log('Connected to database')
})
app.use(express.json({ limit: '10mb' }))
app.use(routes)
app.use(errorMiddleware)

export default app
