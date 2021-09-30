import { NextFunction, Request, Response } from 'express'
import { BaseMiddleware } from 'inversify-express-utils'
import { UnauthorizedError } from '../errors'
import crypto from 'crypto'
import { injectable } from 'inversify'

@injectable()
export default class AuthMiddleware extends BaseMiddleware {
  public handler (req: Request, _res: Response, next: NextFunction): void {
    this.verifyTrelloWebhookRequest(req)
    next()
  }

  public verifyTrelloWebhookRequest (req: Request): void {
    const base64Digest = (content: string): string => {
      return crypto.createHmac('sha1', process.env.TRELLO_SECRET ?? '').update(content)
        .digest('base64')
    }
    const content = JSON.stringify(req.body) + `https://${req.hostname}${req.baseUrl}`
    const doubleHash = base64Digest(content)
    const headerHash = req.headers['x-trello-webhook']

    if (doubleHash !== headerHash) {
      throw new UnauthorizedError('Invalid signature.')
    }
  }
}
