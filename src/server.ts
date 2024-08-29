import server from './app'
const port = 80
server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
