import BaseError from './base'

export default class NotFoundError extends BaseError {
  public constructor (message?: string) {
    super(message ?? 'Not Found', 404)
  }
}
