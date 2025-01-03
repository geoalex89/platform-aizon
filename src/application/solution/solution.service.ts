import { Solution } from '../../domain/entities/solution.entity';
import { SolutionRepository } from '../../domain/ports/repositories/solution.repository';
import { SolutionError } from './solution.error';

export class SolutionService {
  constructor(private solutionRepository: SolutionRepository) {}

  async getSolutions(ownerId: string): Promise<Solution[]> {
    return this.solutionRepository.findByOwner(ownerId);
  }

  async createSolution(solution: Omit<Solution, 'id' | 'screenIds'>): Promise<Solution> {
    return this.solutionRepository.create({
      ...solution,
      screenIds: []
    });
  }

  async updateSolution(id: string, ownerId: string, update: Partial<Solution>): Promise<Solution> {
    const solution = await this.solutionRepository.findById(id);
    if (!solution) {
      throw new SolutionError('Solution not found');
    }
    
    if (solution.ownerId !== ownerId) {
      throw new SolutionError('Not authorized to update this solution', SolutionError.UNAUTHORIZED);
    }

    const updated = await this.solutionRepository.update(id, update);
    if (!updated) {
      throw new SolutionError('Failed to update solution', SolutionError.UPDATE_FAILED);
    }

    return updated;
  }

  async deleteSolution(id: string, ownerId: string): Promise<void> {
    const solution = await this.solutionRepository.findById(id);
    if (!solution) {
      throw new SolutionError('Solution not found');
    }

    if (solution.ownerId !== ownerId) {
      throw new SolutionError('Not authorized to delete this solution', SolutionError.UNAUTHORIZED);
    }

    const deleted = await this.solutionRepository.delete(id);
    if (!deleted) {
      throw new SolutionError('Failed to delete solution', SolutionError.DELETE_FAILED);
    }
  }
}