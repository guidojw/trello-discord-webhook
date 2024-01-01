import {
  BaseHttpController,
  controller,
  httpHead,
  httpPost,
  interfaces,
  requestBody,
  requestParam,
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

  @httpHead('/:id')
  public head (): results.StatusCodeResult {
    return this.statusCode(200)
  }

  @httpPost(
    '/:id',
    ...TrelloController.validate('postWebhook'),
    TYPES.AuthMiddleware,
    TYPES.ErrorMiddleware
  )
  public async postWebhook (@requestParam('id') id: string, @requestBody() body: { action: any }): Promise<results.StatusCodeResult> {
    const payload = await this.trelloService.getActionPayload(body.action, id);
    if (typeof payload !== 'undefined') {
      await this.discordMessageJob.run({ ...payload, files: undefined }, payload.files, id)
    }
    return this.statusCode(200)
  }

  private static validate (method: string): ValidationChain[] {
    switch (method) {
      case 'postWebhook':
        return [
          body('action').exists().isObject(),
          body('model').exists().isObject()
        ]

      default:
        return []
    }
  }
}
