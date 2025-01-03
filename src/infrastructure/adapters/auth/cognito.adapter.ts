import { AuthProvider } from '../../../domain/ports/auth/auth.provider';
import { CognitoAuthProvider } from './cognito.auth';

export class CognitoAuthAdapter implements AuthProvider {
  private cognitoProvider: CognitoAuthProvider;

  constructor() {
    this.cognitoProvider = new CognitoAuthProvider();
  }

  async register(email: string, password: string): Promise<string> {
    return this.cognitoProvider.register(email, password);
  }

  async login(email: string, password: string): Promise<string> {
    return this.cognitoProvider.login(email, password);
  }
}