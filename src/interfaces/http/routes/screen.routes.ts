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

export const screenRoutes = (screenService: ScreenService): FastifyPluginAsync => {
  return async (fastify) => {
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.get('/:solutionId', async (request) => {
      return screenService.getScreens(request.params.solutionId, request.user.id);
    });

    fastify.post('/', async (request) => {
      const data = screenSchema.parse(request.body);
      return screenService.createScreen(data, request.user.id);
    });

    fastify.put('/:id', async (request) => {
      const data = screenUpdateSchema.parse(request.body);
      return screenService.updateScreen(request.params.id, request.user.id, data);
    });

    fastify.delete('/:id', async (request) => {
      await screenService.deleteScreen(request.params.id, request.user.id);
      return { success: true };
    });
  };
};