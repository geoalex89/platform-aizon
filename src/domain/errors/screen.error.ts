import { BaseError } from './base.error';

export class ScreenError extends BaseError {
  static readonly NOT_FOUND = 'SCREEN_NOT_FOUND';
  static readonly UPDATE_FAILED = 'SCREEN_UPDATE_FAILED';
  static readonly DELETE_FAILED = 'SCREEN_DELETE_FAILED';
  static readonly UNAUTHORIZED = 'SCREEN_UNAUTHORIZED';

  constructor(message: string, code?: string) {
    const errorCode = code || ScreenError.NOT_FOUND;
    const statusCode = code === ScreenError.UNAUTHORIZED ? 403 : 404;
    super(message, errorCode, statusCode);
  }
}