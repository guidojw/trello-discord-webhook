import { Application } from 'express'
import container from '../configs/container'
import expressLoader from './express'

export function init (): Application {
  const app = expressLoader(container)

  return app
}
