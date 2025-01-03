import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { WidgetService } from '../../../application/widget/widget.service';

const positionSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  width: z.number().int().min(1),
  height: z.number().int().min(1)
});

const widgetSchema = z.object({
  name: z.string(),
  type: z.enum(['bar', 'pie', 'line', 'image'] as const),
  screenId: z.string(),
  position: positionSchema,
  config: z.record(z.any())
});

type User = {id: string;};
const widgetUpdateSchema = widgetSchema.partial();

export const widgetRoutes = (widgetService: WidgetService): FastifyPluginAsync => {
  return async (fastify) => {
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.get('/:screenId', async (request) => {
      const params = request.params as { screenId: string };
      const user = request.user as User;
      return widgetService.getWidgets(params.screenId, user.id);
    });

    fastify.post('/', async (request) => {
      const data = widgetSchema.parse(request.body);
      const user = request.user as User;
      return widgetService.createWidget(data, user.id);
    });

    fastify.put('/:id', async (request) => {
      const params = request.params as { id: string };
      const data = widgetUpdateSchema.parse(request.body);
      const user = request.user as User;
      return widgetService.updateWidget(params.id, user.id, data);
    });

    fastify.delete('/:id', async (request) => {
      const params = request.params as { id: string };
      const user = request.user as User;
      await widgetService.deleteWidget(params.id, user.id);
      return { success: true };
    });
  };
};