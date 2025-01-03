import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { createContainer } from '../../../src/config/container';
import { authRoutes } from '../../../src/interfaces/http/routes/auth.routes';
import { solutionRoutes } from '../../../src/interfaces/http/routes/solution.routes';
import { screenRoutes } from '../../../src/interfaces/http/routes/screen.routes';
import { widgetRoutes } from '../../../src/interfaces/http/routes/widget.routes';
import { errorHandler } from '../../../src/interfaces/http/middleware/error-handler';

export async function createServer(): Promise<FastifyInstance> {
  const fastify = Fastify({ logger: false });
  const container = createContainer();

  await fastify.register(cors);
  await fastify.register(jwt, { secret: 'test-secret' });
  
  fastify.setErrorHandler(errorHandler);

  await fastify.register(authRoutes(container.authService), { prefix: '/auth' });
  await fastify.register(solutionRoutes(container.solutionService), { prefix: '/solutions' });
  await fastify.register(screenRoutes(container.screenService), { prefix: '/screens' });
  await fastify.register(widgetRoutes(container.widgetService), { prefix: '/widgets' });

  return fastify;
}