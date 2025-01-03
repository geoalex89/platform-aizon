import { AuthService } from '../application/auth/auth.service';
import { ScreenService } from '../application/screen/screen.service';
import { SolutionService } from '../application/solution/solution.service';
import { WidgetService } from '../application/widget/widget.service';
import { MongoUserRepository } from '../infrastructure/adapters/repositories/mongoose/user.repository';
import { MongoScreenRepository } from '../infrastructure/adapters/repositories/mongoose/screen.repository';
import { MongoSolutionRepository } from '../infrastructure/adapters/repositories/mongoose/solution.repository';
import { MongoWidgetRepository } from '../infrastructure/adapters/repositories/mongoose/widget.repository';
import { DynamoDBUserRepository } from '../infrastructure/adapters/repositories/dynamodb/user.repository';
import { CognitoAuthAdapter } from '../infrastructure/adapters/auth/cognito.adapter';
import { env } from './env';

export function createContainer() {
  // Initialize repositories based on configuration
  const userRepository = env.USE_DYNAMODB 
    ? new DynamoDBUserRepository()
    : new MongoUserRepository();
    
  const screenRepository = new MongoScreenRepository();
  const solutionRepository = new MongoSolutionRepository();
  const widgetRepository = new MongoWidgetRepository();
  
  // Initialize auth provider
  const authProvider = env.USE_DYNAMODB 
    ? new CognitoAuthAdapter()
    : undefined;
  
  // Initialize services
  const authService = new AuthService(userRepository, authProvider);
  const solutionService = new SolutionService(solutionRepository);
  const screenService = new ScreenService(screenRepository, solutionRepository);
  const widgetService = new WidgetService(widgetRepository, screenRepository, solutionRepository);

  return {
    authService,
    solutionService,
    screenService,
    widgetService
  };
}