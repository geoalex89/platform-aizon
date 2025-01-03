import { BaseError } from './base.error';

export class WidgetError extends BaseError {
  static readonly NOT_FOUND = 'WIDGET_NOT_FOUND';
  static readonly UPDATE_FAILED = 'WIDGET_UPDATE_FAILED';
  static readonly DELETE_FAILED = 'WIDGET_DELETE_FAILED';
  static readonly UNAUTHORIZED = 'WIDGET_UNAUTHORIZED';
  static readonly INVALID_POSITION = 'WIDGET_INVALID_POSITION';

  constructor(message: string, code?: string) {
    const errorCode = code || WidgetError.NOT_FOUND;
    const statusCode = code === WidgetError.UNAUTHORIZED ? 403 : 404;
    super(message, errorCode, statusCode);
  }
}