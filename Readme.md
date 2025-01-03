# Platform Aizon

A modern Node.js backend service built with Fastify and MongoDB, following clean architecture principles.

## Features

- 🔐 JWT Authentication
- 🎯 Hexagonal Architecture
- 🔄 MongoDB Integration & DynamoDB Integration
- ⚡ Fast & Type-safe with TypeScript
- 🧪 Comprehensive Testing

## Tech Stack

- Node.js 20+
- Fastify
- MongoDB & DynamoDB
- TypeScript
- Jest
- Zod

## Getting Started

### Prerequisites

- Node.js 20 or higher
- MongoDB instance

### Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/platform
JWT_SECRET=your-secret-key
NODE_ENV=development
USE_DYNAMODB=false
```

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Testing
- Just unit test works, because the e2e is not fully-completed.

```bash
# Unit tests
npm test
```

## API Documentation

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Solutions

All solution endpoints require authentication via JWT token in the Authorization header.

#### Get Solutions
```http
GET /solutions
Authorization: Bearer <token>
```

#### Create Solution
```http
POST /solutions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Solution",
  "description": "Solution description"
}
```

#### Update Solution
```http
PUT /solutions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Solution",
  "description": "Updated description"
}
```

#### Delete Solution
```http
DELETE /solutions/:id
Authorization: Bearer <token>
```

## Project Structure

```
src/
├── application/       # Application business logic
├── domain/           # Domain entities and interfaces
├── infrastructure/   # External services implementation
└── interfaces/       # API routes and controllers
```

## Architecture

The project follows Hexagonal Architecture principles:

- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases and business rules
- **Infrastructure Layer**: External services implementation
- **Interface Layer**: API routes and controllers

## Testing Strategy

- **Unit Tests**: Test individual components in isolation
- **E2E Tests**: Test complete user flows
- **Integration Tests**: Test interaction between components