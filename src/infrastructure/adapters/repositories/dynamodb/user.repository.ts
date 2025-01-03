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

  async findById(id: string): Promise<User | null> {
    const results = await this.query(
      'id = :id',
      { ':id': id }
    );
    return results[0] || null;
  }

  async create(user: User): Promise<User> {
    // TODO
  }

  async update(id: string, user: User): Promise<User> {
    // TODO
  }

  async delete(id: string): Promise<boolean> {
    // TODO
  }
}