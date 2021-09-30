import BaseJob from './base'
import FormData from 'form-data'
import type { RESTPostAPIWebhookWithTokenJSONBody } from 'discord-api-types/v9'
import axios from 'axios'
import { injectable } from 'inversify'

@injectable()
export default class DiscordMessageJob implements BaseJob {
  public async run (
    data: RESTPostAPIWebhookWithTokenJSONBody,
    files: Record<string, unknown> | undefined
  ): Promise<any> {
    if (typeof process.env.DISCORD_WEBHOOK_URL !== 'undefined') {
      let body
      let headers: Record<string, string> = {}
      if (typeof files === 'undefined') {
        body = data
        headers['Content-Type'] = 'application/json'
      } else {
        body = new FormData()
        body.append('payload_json', JSON.stringify(data))
        for (const [fileName, fileData] of Object.entries(files)) {
          body.append(fileName, fileData, fileName)
        }
        headers = body.getHeaders()
      }

      await axios.post(process.env.DISCORD_WEBHOOK_URL, body, { headers })
    }
  }
}
