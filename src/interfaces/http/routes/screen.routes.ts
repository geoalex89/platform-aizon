import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { ScreenService } from '../../../application/screen/screen.service';

const screenSchema = z.object({
  name: z.string(),
  solutionId: z.string(),
  layout: z.object({
    columns: z.number().int().min(1).max(24),
    rows: z.number().int().min(1).max(24)
  })
});

const screenUpdateSchema = screenSchema.partial();

type User = {id: string;};

export const screenRoutes = (screenService: ScreenService): FastifyPluginAsync => {
  return async (fastify) => {
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.get('/:solutionId', async (request) => {
      const params = request.params as { solutionId: string };
      const user = request.user as User;
      return screenService.getScreens(params.solutionId, user.id);
    });

    fastify.post('/', async (request) => {
      const data = screenSchema.parse(request.body);
      const user = request.user as User;
      return screenService.createScreen(data, user.id);
    });

    fastify.put('/:id', async (request, reply) => {
      const params = request.params as { id: string };
      const data = screenUpdateSchema.parse(request.body);
      const user = request.user as User;
      return screenService.updateScreen(params.id, user.id, data);
    });

    fastify.delete('/:id', async (request, reply) => {
      const params = request.params as { id: string };
      const user = request.user as User;
      await screenService.deleteScreen(params.id, user.id);
      return { success: true };
    });
  };
};