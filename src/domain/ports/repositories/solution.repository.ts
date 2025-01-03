import { Solution } from '../../entities/solution.entity';

export interface SolutionRepository {
  findById(id: string): Promise<Solution | null>;
  findByOwner(ownerId: string): Promise<Solution[]>;
  create(solution: Solution): Promise<Solution>;
  update(id: string, solution: Partial<Solution>): Promise<Solution | null>;
  delete(id: string): Promise<boolean>;
}