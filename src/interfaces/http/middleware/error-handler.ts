import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { BaseError } from '../../../domain/errors/base.error';
import { ZodError } from 'zod';

export async function errorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

  if (error instanceof BaseError) {
    return reply
      .status(error.statusCode)
      .send({ 
        error: error.message,
        code: error.code
      });
  }

  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ 
        error: 'Validation error',
        details: error.errors
      });
  }

  // Default error response
  return reply
    .status(500)
    .send({ 
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    });
}