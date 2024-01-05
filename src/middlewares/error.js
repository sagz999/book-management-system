import HttpError from '../utils/HttpError.js'

function errorMiddleware(error, _req, res, _next) {
  console.error(error)

  if (error instanceof HttpError) return res.status(error.status).send(error)

  if (error.code === 11000) {
    const value = JSON.parse(JSON.stringify(error.message.match(/{[^}]+}/)[0]))
    return res.status(400).send(new HttpError(400, { message: 'DUPLICATE DATA', value }))
  }

  return res.status(500).send(new HttpError(500))
}

export default errorMiddleware
