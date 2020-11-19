'use strict'
const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const hpp = require('hpp')

const { NotFoundError } = require('../errors')

function init (app, container) {
  const errorMiddleware = container.get('ErrorMiddleware')

  app.use(logger('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(helmet())
  app.use(hpp())

  app.use('/api/v1/trello', container.get('TrelloRouter'))

  app.use(() => {
    throw new NotFoundError()
  })

  app.use((err, req, res, _next) => {
    errorMiddleware.sendError(res, err.statusCode || 500, err.message)
  })
}

module.exports = init
