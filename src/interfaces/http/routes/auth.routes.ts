import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { AuthService } from '../../../application/auth/auth.service';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const authRoutes = (authService: AuthService): FastifyPluginAsync => {
  return async (fastify) => {
    fastify.post('/login', async (request, reply) => {
      const { email, password } = loginSchema.parse(request.body);
      
      try {
        const user = await authService.login(email, password);
        const token = fastify.jwt.sign({ id: user.user.id });
        return { token };
      } catch (error) {
        const errorMessage = (error as Error).message;
        return reply.code(401).send({ error: errorMessage });
      }
    });

    fastify.post('/register', async (request, reply) => {
      const { email, password } = loginSchema.parse(request.body);
      
      try {
        const user = await authService.register(email, password);
        const token = fastify.jwt.sign({ id: user.user.id });
        return { token };
      } catch (error) {
        const errorMessage = (error as Error).message;
        return reply.code(400).send({ error: errorMessage });
      }
    });
  };
};