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
      return solutionService.getSolutions(request.user.id);
    });

    fastify.post('/', async (request) => {
      const data = solutionSchema.parse(request.body);
      return solutionService.createSolution({
        ...data,
        ownerId: request.user.id
      });
    });

    fastify.put('/:id', async (request, reply) => {
      const data = solutionSchema.parse(request.body);
      try {
        return await solutionService.updateSolution(
          request.params.id,
          request.user.id,
          data
        );
      } catch (error) {
        return reply.code(404).send({ error: error.message });
      }
    });

    fastify.delete('/:id', async (request, reply) => {
      try {
        await solutionService.deleteSolution(request.params.id, request.user.id);
        return { success: true };
      } catch (error) {
        return reply.code(404).send({ error: error.message });
      }
    });
  };
};