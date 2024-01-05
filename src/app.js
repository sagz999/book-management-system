import cors from 'cors'
import express from 'express'

// import auth from './middlewares/authentication.js'
// import errorMiddleware from './middlewares/error.js'

import HttpError from './utils/HttpError.js'
import authController from './controllers/public.js'
import controllers from './controllers/index.js'

import {verifyToken} from './middlewares/authentication.js'

const app = express()

app.set('trust proxy')

app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false }))

app.get('/ping', (_, res) => {
  res.status(200).send('pong')
})

// app.use(auth)
// app.use('/api/auth',authController)
// app.use(verifyToken)
app.use(`${process.env.BASE_URL ?? ''}/api`, controllers)

app.all('*', (req, res, next) => {
  next(new HttpError(404, `Can't find ${req.originalUrl} on this server!`))
})

// app.use(errorMiddleware)

export default app
