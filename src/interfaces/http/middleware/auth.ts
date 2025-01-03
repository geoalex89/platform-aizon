import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { User } from '../../../domain/user/user.entity';

declare module 'fastify' {
  interface FastifyRequest {
    user: User;
  }
}

export async function registerAuthHooks(fastify: FastifyInstance) {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      
      // Add user to request for use in routes
      request.user = {
        id: request.user.id,
        email: request.user.email,
        role: request.user.role
      };
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
}