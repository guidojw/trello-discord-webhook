import 'express-async-errors'
import 'reflect-metadata'
import * as loaders from './loaders'
import dotenv from 'dotenv'

dotenv.config()

export default loaders.init()
