import { FastifyInstance } from 'fastify';
import { createServer } from './helpers/server';
import { UserModel } from '../../src/infrastructure/adapters/repositories/mongoose/schemas/user.schema';

describe('Auth Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: 'test@test.com',
          password: 'password123'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveProperty('token');

      const user = await UserModel.findOne({ email: 'test@test.com' });
      expect(user).toBeTruthy();
    });

    it('should return 400 when email is already registered', async () => {
      // First registration
      await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: 'duplicate@test.com',
          password: 'password123'
        }
      });

      // Duplicate registration
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: 'duplicate@test.com',
          password: 'password123'
        }
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: 'login@test.com',
          password: 'password123'
        }
      });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'login@test.com',
          password: 'password123'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveProperty('token');
    });

    it('should return 401 with incorrect password', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'login@test.com',
          password: 'wrongpassword'
        }
      });

      expect(response.statusCode).toBe(401);
    });
  });
});