import { BaseError } from '../../domain/errors/base.error';

export class AuthError extends BaseError {
  static readonly INVALID_CREDENTIALS = 'INVALID_CREDENTIALS';
  static readonly EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS';

  constructor(message: string, code?: string) {
    const errorCode = code || AuthError.INVALID_CREDENTIALS;
    const statusCode = errorCode === AuthError.EMAIL_ALREADY_EXISTS ? 400 : 401;
    super(message, errorCode, statusCode);
  }
}