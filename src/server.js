import app from './app.js'
import mongoClient from './dbContext/mongo.js'

const PORT = process.env.PORT ?? '3000'

app.listen(+PORT, async () => {
  await mongoClient.start()
  console.log(
    `[${new Date().toISOString()}] [INFO] local - App listening at http://localhost:${PORT}`
  )
})

process.on('unhandledRejection', reason => {
  console.error('UNHANDLED_REJECTION: ', reason)
})