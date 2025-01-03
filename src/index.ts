import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import mongoose from 'mongoose';
import { env } from './config/env';
import { createContainer } from './config/container';
import authPlugin from './interfaces/http/plugins/auth.plugin';
import { authRoutes } from './interfaces/http/routes/auth.routes';
import { solutionRoutes } from './interfaces/http/routes/solution.routes';
import { screenRoutes } from './interfaces/http/routes/screen.routes';
import { widgetRoutes } from './interfaces/http/routes/widget.routes';
import { errorHandler } from './interfaces/http/middleware/error-handler';

async function bootstrap() {
  const fastify = Fastify({ logger: true });
  const container = createContainer();

  // Register plugins
  await fastify.register(cors);
  await fastify.register(jwt, { secret: env.JWT_SECRET });
  await fastify.register(swagger);
  await fastify.register(swaggerUi);
  await fastify.register(authPlugin);

  // Register error handler
  fastify.setErrorHandler(errorHandler);

  // Register routes
  await fastify.register(authRoutes(container.authService), { prefix: '/auth' });
  await fastify.register(solutionRoutes(container.solutionService), { prefix: '/solutions' });
  await fastify.register(screenRoutes(container.screenService), { prefix: '/screens' });
  await fastify.register(widgetRoutes(container.widgetService), { prefix: '/widgets' });

  // Connect to MongoDB
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }

  // Start server
  try {
    await fastify.listen({ port: parseInt(env.PORT) });
    console.log(`Server listening on port ${env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

bootstrap();