import axios from 'axios'
import fs from 'node:fs'
import path from 'node:path'

export async function downloadAttachment (url: string, id: string): Promise<Buffer> {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json'), 'utf8'));
  const thisconfig = config.services[id];
  return Buffer.from(
    (await axios.get(url, {
      headers: {
        Authorization: `OAuth oauth_consumer_key="${thisconfig.TRELLO_KEY}", oauth_token="${thisconfig.TRELLO_TOKEN}"`
      },
      responseType: 'arraybuffer'
    })).data,
    'binary'
  )
}
