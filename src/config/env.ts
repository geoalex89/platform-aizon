import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  USE_DYNAMODB: z.string().transform(val => val === 'true').default('false'),
  
  // AWS Configuration (optional when USE_DYNAMODB is false)
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_COGNITO_USER_POOL_ID: z.string().optional(),
  AWS_COGNITO_CLIENT_ID: z.string().optional(),
});

export const env = envSchema.parse(process.env);