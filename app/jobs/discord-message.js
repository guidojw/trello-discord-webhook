'use strict'
const axios = require('axios')

class DiscordMessageJob {
  async run (content) {
    await axios({
      method: 'post',
      url: process.env.DISCORD_WEBHOOK_URL,
      data: content
    })
  }
}

module.exports = DiscordMessageJob
