import BaseError from './base'

export default class UnauthorizedError extends BaseError {
  public constructor (message?: string) {
    super(message ?? 'Unauthorized', 401)
  }
}
