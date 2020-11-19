'use strict'
const { body } = require('express-validator')

class TrelloController {
  constructor (trelloService, discordMessageJob) {
    this._trelloService = trelloService
    this._discordMessageJob = discordMessageJob
  }

  head (req, res) {
    res.sendStatus(200)
  }

  async postWebhook (req, res) {
    const embed = await this._trelloService.getActionEmbed(req.body.action)
    if (embed) {
      await this._discordMessageJob.run('trello', { embeds: [embed] })
    }
    res.sendStatus(200)
  }

  validate (method) {
    switch (method) {
      case 'postWebhook':
        return [
          body('action').exists(),
          body('model').exists()
        ]
    }
  }
}

module.exports = TrelloController
