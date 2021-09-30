import {
  BaseHttpController,
  controller,
  httpHead,
  httpPost,
  interfaces,
  requestBody,
  results
} from 'inversify-express-utils'
import { ValidationChain, body } from 'express-validator'
import { inject, tagged } from 'inversify'
import { BaseJob } from '../../jobs'
import { TrelloService } from '../../services'
import { constants } from '../../util'

const { TYPES } = constants

@controller('/v1/trello')
export default class TrelloController extends BaseHttpController implements interfaces.Controller {
  @inject(TYPES.TrelloService)
  private readonly trelloService!: TrelloService

  @inject(TYPES.Job)
  @tagged('job', 'discordMessage')
  private readonly discordMessageJob!: BaseJob

  @httpHead('/')
  public head (): results.StatusCodeResult {
    return this.statusCode(200)
  }

  @httpPost(
    '/',
    ...TrelloController.validate('postWebhook'),
    // TYPES.AuthMiddleware,
    TYPES.ErrorMiddleware
  )
  public async postWebhook (@requestBody() body: { action: any }): Promise<results.StatusCodeResult> {
    console.log(JSON.stringify(body, null, '\t'))
    const payload = await this.trelloService.getActionPayload(body.action)
    try {
      if (typeof payload !== 'undefined') {
        console.log(payload)
        await this.discordMessageJob.run(payload)
      }
    } catch (err) {
      console.error(err)
    }
    return this.statusCode(200)
  }

  private static validate (method: string): ValidationChain[] {
    switch (method) {
      case 'postWebhook':
        return [
          body('action').exists(),
          body('model').exists()
        ]

      default:
        return []
    }
  }
}
