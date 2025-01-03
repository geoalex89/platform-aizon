import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/ports/repositories/user.repository';
import { AuthProvider } from '../../domain/ports/auth/auth.provider';
import { AuthError } from './auth.error';

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private authProvider: AuthProvider
  ) {}

  async register(email: string, password: string): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AuthError('Email already registered', AuthError.EMAIL_ALREADY_EXISTS);
    }

    const token = await this.authProvider.register(email, password);
    const user = await this.userRepository.create({
      email,
      password,
      role: 'user'
    });

    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthError('Invalid credentials');
    }

    const token = await this.authProvider.login(email, password);
    return { user, token };
  }
}