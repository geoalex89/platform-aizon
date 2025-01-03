import { Screen } from '../../../../domain/entities/screen.entity';
import { ScreenRepository } from '../../../../domain/ports/repositories/screen.repository';
import { ScreenModel } from './schemas/screen.schema';

export class MongoScreenRepository implements ScreenRepository {
  async findById(id: string): Promise<Screen | null> {
    return ScreenModel.findById(id);
  }

  async findBySolution(solutionId: string): Promise<Screen[]> {
    return ScreenModel.find({ solutionId });
  }

  async create(screen: Screen): Promise<Screen> {
    return ScreenModel.create(screen);
  }

  async update(id: string, screen: Partial<Screen>): Promise<Screen | null> {
    return ScreenModel.findByIdAndUpdate(id, screen, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await ScreenModel.findByIdAndDelete(id);
    return !!result;
  }
}