'use strict'
const express = require('express')

class TrelloRouter {
  constructor (trelloController, errorMiddleware, authMiddleware) {
    const handleValidationResult = errorMiddleware.handleValidationResult.bind(errorMiddleware)
    const verifyTrelloWebhookRequest = authMiddleware.verifyTrelloWebhookRequest.bind(authMiddleware)
    const router = express.Router()

    router.route('/')
      .head(trelloController.head.bind(trelloController))
      .post(
        trelloController.validate('postWebhook'),
        handleValidationResult,
        verifyTrelloWebhookRequest,
        trelloController.postWebhook.bind(trelloController)
      )

    return router
  }
}

module.exports = TrelloRouter
