import { UserRepository } from '../../../../domain/ports/repositories/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { DynamoDBRepository } from './base.repository';

export class DynamoDBUserRepository extends DynamoDBRepository<User> implements UserRepository {
  constructor() {
    super('Users');
  }

  async findByEmail(email: string): Promise<User | null> {
    const results = await this.query(
      'email = :email',
      { ':email': email }
    );
    return results[0] || null;
  }
}