import express from 'express'
import { errorMiddleware } from './middleware/errorMiddleware'
import routes from './routes'

const app = express()

app.use(express.json({ limit: '10mb' }))
app.use(routes)
app.use(errorMiddleware)

export default app
