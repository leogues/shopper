import server from './app'
import minioClient from './infrastructure/bucket/minio/minio'
const port = 80

minioClient
  .bucketExists('shopper')
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
