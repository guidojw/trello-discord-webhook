import axios from 'axios'

export async function downloadAttachment (url: string): Promise<Buffer> {
  return Buffer.from(
    (await axios.get(url, {
      headers: {
        Authorization: `OAuth oauth_consumer_key="${process.env.TRELLO_KEY}", oauth_token="${process.env.TRELLO_TOKEN}"`
      },
      responseType: 'arraybuffer'
    })).data,
    'binary'
  )
}
