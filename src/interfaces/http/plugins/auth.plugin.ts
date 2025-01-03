import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { User } from '../../../domain/entities/user.entity';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
  interface FastifyRequest {
    user: User;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('authenticate', async function(request, reply) {
    try {
      await request.jwtVerify();
      request.user = {
        id: request.user.id,
        email: request.user.email,
        role: request.user.role
      };
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
};

export default fp(authPlugin);