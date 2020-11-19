'use strict'
const path = require('path')
const { ContainerBuilder, YamlFileLoader } = require('node-dependency-injection')

function init () {
  const container = new ContainerBuilder(false, path.join(__dirname, '../..'))
  const loader = new YamlFileLoader(container)
  loader.load('./config/application.yml')
  return container
}

module.exports = init
