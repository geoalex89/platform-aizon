import { Solution } from '../../../../domain/entities/solution.entity';
import { SolutionRepository } from '../../../../domain/ports/repositories/solution.repository';
import { SolutionModel } from './schemas/solution.schema';

export class MongoSolutionRepository implements SolutionRepository {
  async findById(id: string): Promise<Solution | null> {
    return SolutionModel.findById(id);
  }

  async findByOwner(ownerId: string): Promise<Solution[]> {
    return SolutionModel.find({ ownerId });
  }

  async create(solution: Solution): Promise<Solution> {
    return SolutionModel.create(solution);
  }

  async update(id: string, solution: Partial<Solution>): Promise<Solution | null> {
    return SolutionModel.findByIdAndUpdate(id, solution, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await SolutionModel.findByIdAndDelete(id);
    return !!result;
  }
}