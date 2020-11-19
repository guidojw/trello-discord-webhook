'use strict'
require('dotenv').config()

const express = require('express')

const loaders = require('./app/loaders')

const app = express()
require('express-async-errors')
loaders.init(app)

module.exports = app
