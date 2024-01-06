import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const HttpStatus = require('./statusCodes.json')

export default class HttpError extends Error {
  /**
   *
   * @param {number} status Http status code. ex. 200
   * @param {any[]} errors Error object or array or string
   * @example throw new HttpError(200, { message: "Hi I'm error", code: "ValidationError" })
   *
   */
  constructor(status, errors = []) {
    super(status)
    const httpStatus = HttpStatus[status]
    if (!httpStatus) throw new Error('Unsupported or invalid status code.')
    this.title = httpStatus.title
    this.detail = httpStatus.detail
    this.status = Number(httpStatus.status)
    this.errors = [errors].flat(1)
  }
}
