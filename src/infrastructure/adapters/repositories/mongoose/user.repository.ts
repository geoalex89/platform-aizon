import { User } from '../../../../domain/entities/user.entity';
import { UserRepository } from '../../../../domain/ports/repositories/user.repository';
import { UserModel } from './schemas/user.schema';

export class MongoUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email });
  }

  async create(user: User): Promise<User> {
    return UserModel.create(user);
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    return UserModel.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }
}