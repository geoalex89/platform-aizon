import {
  SignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
  AdminConfirmSignUpCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '../../../config/aws';
import { env } from '../../../config/env';
import { AuthError } from '../../../application/auth/auth.error';

export class CognitoAuthProvider {
  async register(email: string, password: string): Promise<string> {
    try {
      await cognitoClient.send(new SignUpCommand({
        ClientId: env.AWS_COGNITO_CLIENT_ID,
        Username: email,
        Password: password
      }));

      // Auto confirm user in development
      if (env.NODE_ENV === 'development') {
        await cognitoClient.send(new AdminConfirmSignUpCommand({
          UserPoolId: env.AWS_COGNITO_USER_POOL_ID,
          Username: email
        }));
      }

      return this.login(email, password);
    } catch (error) {
      if (error.name === 'UsernameExistsException') {
        throw new AuthError('Email already registered', AuthError.EMAIL_ALREADY_EXISTS);
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const response = await cognitoClient.send(new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: env.AWS_COGNITO_CLIENT_ID,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      }));

      return response.AuthenticationResult?.IdToken || '';
    } catch (error) {
      throw new AuthError('Invalid credentials');
    }
  }
}