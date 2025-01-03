import { BaseError } from '../../domain/errors/base.error';

export class SolutionError extends BaseError {
  static readonly NOT_FOUND = 'SOLUTION_NOT_FOUND';
  static readonly UPDATE_FAILED = 'SOLUTION_UPDATE_FAILED';
  static readonly DELETE_FAILED = 'SOLUTION_DELETE_FAILED';
  static readonly UNAUTHORIZED = 'SOLUTION_UNAUTHORIZED';

  constructor(message: string, code?: string) {
    const errorCode = code || SolutionError.NOT_FOUND;
    const statusCode = code === SolutionError.UNAUTHORIZED ? 403 : 404;
    super(message, errorCode, statusCode);
  }
}