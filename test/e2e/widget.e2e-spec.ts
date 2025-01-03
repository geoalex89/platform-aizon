import { FastifyInstance } from 'fastify';
import { createServer } from './helpers/server';

describe('Widget Routes', () => {
  let app: FastifyInstance;
  let authToken: string;

  beforeAll(async () => {
    app = await createServer();

    // Create test user and get token
    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        email: 'widget-test@test.com',
        password: 'password123'
      }
    });

    authToken = response.json().token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /widgets', () => {
    it('should create a new widget', async () => {
      const widget = {
        name: 'Test Widget',
        type: 'bar',
        screenId: 'screen1',
        position: { x: 0, y: 0, width: 2, height: 2 },
        config: {}
      };

      const response = await app.inject({
        method: 'POST',
        url: '/widgets',
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: widget
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveProperty('id');
    });
  });
});