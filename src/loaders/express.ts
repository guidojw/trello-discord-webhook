import '../controllers'
import express, { Application, NextFunction, Request, RequestHandler, Response } from 'express'
import { Container } from 'inversify'
import ErrorMiddleware from '../middlewares/error'
import { InversifyExpressServer } from 'inversify-express-utils'
import { NotFoundError } from '../errors'
import { constants } from '../util'
import helmet from 'helmet'
import hpp from 'hpp'
import logger from 'morgan'
import path from 'node:path'

const { TYPES } = constants

export default function init (container: Container): Application {
  return new InversifyExpressServer(container)
    .setConfig(app => {
      app.use(logger('dev') as RequestHandler)
      app.use(express.json() as RequestHandler)
      app.use(express.urlencoded({ extended: false }) as RequestHandler)
      app.use(helmet() as RequestHandler)
      app.use(hpp())
      app.use(function (_, res,n) {
         res.setHeader('Access-Control-Allow-Origin', '*');
         res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
         n();
      })
      app.get('/icon.png', (_, res) => {res.sendFile(path.join(__dirname, '../../icon.png'))})
    })
    .setErrorConfig(app => {
      const errorMiddleware = container.get<ErrorMiddleware>(TYPES.ErrorMiddleware)

      app.use(() => {
        throw new NotFoundError()
      })

      app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        errorMiddleware.sendError(
          res,
          err.response?.status ?? err.statusCode ?? 500,
          err.response?.statusText ?? err.message ?? 'Internal Server Error'
        )
      })
    })
    .build()
}
