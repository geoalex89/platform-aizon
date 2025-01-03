import { Screen } from '../../entities/screen.entity';

export interface ScreenRepository {
  findById(id: string): Promise<Screen | null>;
  findBySolution(solutionId: string): Promise<Screen[]>;
  create(screen: Screen): Promise<Screen>;
  update(id: string, screen: Partial<Screen>): Promise<Screen | null>;
  delete(id: string): Promise<boolean>;
}