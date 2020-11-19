'use strict'
const crypto = require('crypto')

const { UnauthorizedError } = require('../errors')

class AuthMiddleware {
  verifyTrelloWebhookRequest (req, _res, next) {
    const base64Digest = content => {
      return crypto.createHmac('sha1', process.env.TRELLO_SECRET).update(content)
        .digest('base64')
    }
    const content = JSON.stringify(req.body) + `https://${req.hostname}${req.baseUrl}`
    const doubleHash = base64Digest(content)
    const headerHash = req.headers['x-trello-webhook']

    if (doubleHash !== headerHash) {
      throw new UnauthorizedError('Invalid signature.')
    }
    next()
  }
}

module.exports = AuthMiddleware
