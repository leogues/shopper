import server from './app'
import { dataSource } from './infrastructure/database/typeorm/datasource'
const port = 80

dataSource.driver.connect().then(() => {
  console.log('Connected to database')
})

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
