import cors from 'cors'
import express from 'express'

import errorMiddleware from './middlewares/error.js'
import {verifyToken} from './middlewares/authentication.js'

import HttpError from './utils/HttpError.js'
import controllers from './controllers/index.js'

const app = express()

app.set('trust proxy')

app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false }))

// test route
app.get('/ping', (_, res) => {
  res.status(200).send('pong')
})

app.use(verifyToken)
app.use('/api', controllers)

app.all('*', (req, res, next) => {
  next(new HttpError(404, `Can't find ${req.originalUrl} on this server!`))
})

app.use(errorMiddleware)

export default app
