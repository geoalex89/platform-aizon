import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { SolutionService } from '../../../application/solution/solution.service';

const solutionSchema = z.object({
  name: z.string(),
  description: z.string()
});

export const solutionRoutes = (solutionService: SolutionService): FastifyPluginAsync => {
  return async (fastify) => {
    // Add authentication to all routes in this plugin
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.get('/', async (request) => {
      const user = request.user as { id: string };
      return solutionService.getSolutions(user.id);
    });

    fastify.post('/', async (request) => {
      const user = request.user as { id: string };
      const data = solutionSchema.parse(request.body);
      return solutionService.createSolution({
        ...data,
        ownerId: user.id
      });
    });

    fastify.put('/:id', async (request, reply) => {
      const user = request.user as { id: string };
      const params = request.params as { id: string };
      const data = solutionSchema.parse(request.body);
      try {
        return await solutionService.updateSolution(
          params.id,
          user.id,
          data
        );
      } catch (error) {
        return reply.code(404).send({ error: (error as Error).message });
      }
    });

    fastify.delete('/:id', async (request, reply) => {
      const user = request.user as { id: string };
      const params = request.params as { id: string };
      try {
        await solutionService.deleteSolution(params.id, user.id);
        return { success: true };
      } catch (error) {
        return reply.code(404).send({ error: (error as Error).message });
      }
    });
  };
};