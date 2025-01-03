import { AuthService } from '../../src/application/auth/auth.service';
import { UserRepository } from '../../src/domain/ports/repositories/user.repository';
import { AuthError } from '../../src/application/auth/auth.error';
import { AuthProvider } from '../../src/domain/ports/auth/auth.provider';
import bcrypt from 'bcryptjs';
import { jest } from '@jest/globals';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockAuthProvider: jest.Mocked<AuthProvider>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    
    mockAuthProvider = {
      register: jest.fn(),
      login: jest.fn()
    };

    authService = new AuthService(mockUserRepository, mockAuthProvider);
  });

  describe('register', () => {
    it('should create a new user when email is not taken', async () => {
      const userData = { email: 'test@test.com', password: 'password123' };
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({ ...userData, id: '1', role: 'user' });

      const result = await authService.register(userData.email, userData.password);

      expect(result).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should throw AuthError when email is already taken', async () => {
      const userData = { email: 'test@test.com', password: 'password123' };
      mockUserRepository.findByEmail.mockResolvedValue({ ...userData, id: '1', role: 'user' });

      await expect(authService.register(userData.email, userData.password))
        .rejects
        .toThrow(AuthError);
    });
  });

  describe('login', () => {
    it('should return user when credentials are valid', async () => {
      const userData = { 
        email: 'test@test.com', 
        password: await bcrypt.hash('password123', 10),
        id: '1',
        role: 'user' as 'user'
      };
      mockUserRepository.findByEmail.mockResolvedValue(userData);

      const result = await authService.login('test@test.com', 'password123');

      expect(result).toBeDefined();
      expect(result.user.email).toBe(userData.email);
    });

    it('should throw AuthError when user is not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login('test@test.com', 'password123'))
        .rejects
        .toThrow(AuthError);
    });
  });
});