import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const HttpStatus = require('./statusCodes.json')

export default class HttpRes {
  /**
   *
   * @param {number} status Http status code. ex. 200
   * @param {any[]} result Result response object or array
   * @example const response =  new HttpRes(200, { message: "Hi I'm error", code: "ValidationError" })
   *
   */
  constructor(status, results = []) {
    const httpStatus = HttpStatus[status]
    if (!httpStatus) throw new Error('Unsupported or invalid status code.')
    this.title = httpStatus.title
    this.detail = httpStatus.detail
    this.status = Number(httpStatus.status)
    this.results = [results].flat(1)
  }
}
