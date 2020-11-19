'use strict'
const expressLoader = require('./express')
const containerLoader = require('./container')

async function init (app) {
  const container = containerLoader()
  app.set('container', container)

  expressLoader(app, container)
}

module.exports = {
  init
}
