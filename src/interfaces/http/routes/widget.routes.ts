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

const widgetUpdateSchema = widgetSchema.partial();

export const widgetRoutes = (widgetService: WidgetService): FastifyPluginAsync => {
  return async (fastify) => {
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.get('/:screenId', async (request) => {
      return widgetService.getWidgets(request.params.screenId, request.user.id);
    });

    fastify.post('/', async (request) => {
      const data = widgetSchema.parse(request.body);
      return widgetService.createWidget(data, request.user.id);
    });

    fastify.put('/:id', async (request) => {
      const data = widgetUpdateSchema.parse(request.body);
      return widgetService.updateWidget(request.params.id, request.user.id, data);
    });

    fastify.delete('/:id', async (request) => {
      await widgetService.deleteWidget(request.params.id, request.user.id);
      return { success: true };
    });
  };
};