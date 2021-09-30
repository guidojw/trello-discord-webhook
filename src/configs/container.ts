import { AuthMiddleware, ErrorMiddleware } from '../middlewares'
import type { BaseJob } from '../jobs'
import { Container } from 'inversify'
import { DiscordMessageJob } from '../jobs'
import { TrelloService } from '../services'
import { constants } from '../util'

const { TYPES } = constants

const container = new Container()
const bind = container.bind.bind(container)

// Jobs
bind<BaseJob>(TYPES.Job).to(DiscordMessageJob)
  .whenTargetTagged('job', 'discordMessage')

// Middlewares
bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware)
bind<ErrorMiddleware>(TYPES.ErrorMiddleware).to(ErrorMiddleware)

// Services
bind<TrelloService>(TYPES.TrelloService).to(TrelloService)

export default container
