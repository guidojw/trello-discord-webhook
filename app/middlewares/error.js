'use strict'
const { validationResult } = require('express-validator')

class ErrorMiddleware {
  async handleValidationResult (req, res, next) {
    const errors = await validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    this.sendErrors(res, 422, errors.array())
  }

  sendError (res, statusCode, message) {
    this.sendErrors(res, statusCode, [{ message }])
  }

  sendErrors (res, statusCode, errors) {
    res.status(statusCode).send({ errors })
  }
}

module.exports = ErrorMiddleware
