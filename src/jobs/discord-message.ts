import BaseJob from './base'
import { WebhookClient } from 'discord.js'
import { injectable } from 'inversify'

@injectable()
export default class DiscordMessageJob implements BaseJob {
  public async run (data: any): Promise<any> {
    if (typeof process.env.DISCORD_WEBHOOK_URL !== 'undefined') {
      const client = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL })
      await client.send(data)
      client.destroy()
    }
  }
}
