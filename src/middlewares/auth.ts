import { NextFunction, Request, Response } from 'express'
import { BaseMiddleware } from 'inversify-express-utils'
import { UnauthorizedError } from '../errors'
import crypto from 'crypto'
import fs from 'node:fs'
import path from 'node:path'
import { injectable } from 'inversify'

@injectable()
export default class AuthMiddleware extends BaseMiddleware {
  public handler (req: Request, _res: Response, next: NextFunction): void {
    this.verifyTrelloWebhookRequest(req)
    next()
  }

  public verifyTrelloWebhookRequest (req: Request): void {
    const parts = req.url.split('/');
    const id = parts.pop() ?? '';
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json'), 'utf8'));
    const thisconfig = config.services[id];
    if (!thisconfig) throw new UnauthorizedError('Invalid signature.');

    const base64Digest = (content: string): string => {
      return crypto.createHmac('sha1', thisconfig.TRELLO_SECRET ?? '').update(content)
        .digest('base64')
    }
    const content = `${JSON.stringify(req.body)}${thisconfig.TRELLO_CALLBACK_URL}`
    const doubleHash = base64Digest(content)
    const headerHash = req.headers['x-trello-webhook']

    if (doubleHash !== headerHash) {
      throw new UnauthorizedError('Invalid signature.')
    }
  }
}
