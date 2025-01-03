import { Screen } from '../../domain/entities/screen.entity';
import { ScreenRepository } from '../../domain/ports/repositories/screen.repository';
import { ScreenError } from '../../domain/errors/screen.error';
import { SolutionRepository } from '../../domain/ports/repositories/solution.repository';

export class ScreenService {
  constructor(
    private screenRepository: ScreenRepository,
    private solutionRepository: SolutionRepository
  ) {}

  async getScreens(solutionId: string, userId: string): Promise<Screen[]> {
    const solution = await this.solutionRepository.findById(solutionId);
    if (!solution || solution.ownerId !== userId) {
      throw new ScreenError('Solution not found or unauthorized', ScreenError.UNAUTHORIZED);
    }
    return this.screenRepository.findBySolution(solutionId);
  }

  async createScreen(screen: Omit<Screen, 'id' | 'widgetIds'>, userId: string): Promise<Screen> {
    const solution = await this.solutionRepository.findById(screen.solutionId);
    if (!solution || solution.ownerId !== userId) {
      throw new ScreenError('Solution not found or unauthorized', ScreenError.UNAUTHORIZED);
    }

    const newScreen = await this.screenRepository.create({
      ...screen,
      widgetIds: []
    });

    await this.solutionRepository.update(screen.solutionId, {
      screenIds: [...solution.screenIds, newScreen.id!]
    });

    return newScreen;
  }

  async updateScreen(id: string, userId: string, update: Partial<Screen>): Promise<Screen> {
    const screen = await this.screenRepository.findById(id);
    if (!screen) {
      throw new ScreenError('Screen not found');
    }

    const solution = await this.solutionRepository.findById(screen.solutionId);
    if (!solution || solution.ownerId !== userId) {
      throw new ScreenError('Not authorized to update this screen', ScreenError.UNAUTHORIZED);
    }

    const updated = await this.screenRepository.update(id, update);
    if (!updated) {
      throw new ScreenError('Failed to update screen', ScreenError.UPDATE_FAILED);
    }

    return updated;
  }

  async deleteScreen(id: string, userId: string): Promise<void> {
    const screen = await this.screenRepository.findById(id);
    if (!screen) {
      throw new ScreenError('Screen not found');
    }

    const solution = await this.solutionRepository.findById(screen.solutionId);
    if (!solution || solution.ownerId !== userId) {
      throw new ScreenError('Not authorized to delete this screen', ScreenError.UNAUTHORIZED);
    }

    const deleted = await this.screenRepository.delete(id);
    if (!deleted) {
      throw new ScreenError('Failed to delete screen', ScreenError.DELETE_FAILED);
    }

    await this.solutionRepository.update(screen.solutionId, {
      screenIds: solution.screenIds.filter(screenId => screenId !== id)
    });
  }
}