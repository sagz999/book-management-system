import app from './app.js'
import mongoClient from './dbContext/mongo.js'

const PORT = process.env.PORT ?? '3000'
const BASE_URL = process.env.BASE_URL

app.listen(+PORT, async () => {
  await mongoClient.start()
  console.log(
    `[${new Date().toISOString()}] [INFO] local - App listening at ${BASE_URL}`
  )
})

process.on('unhandledRejection', reason => {
  console.error('UNHANDLED_REJECTION: ', reason)
})