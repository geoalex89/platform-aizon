import { Widget } from '../../domain/entities/widget.entity';
import { WidgetRepository } from '../../domain/ports/repositories/widget.repository';
import { WidgetError } from '../../domain/errors/widget.error';
import { ScreenRepository } from '../../domain/ports/repositories/screen.repository';
import { SolutionRepository } from '../../domain/ports/repositories/solution.repository';

export class WidgetService {
  constructor(
    private widgetRepository: WidgetRepository,
    private screenRepository: ScreenRepository,
    private solutionRepository: SolutionRepository
  ) {}

  async getWidgets(screenId: string, userId: string): Promise<Widget[]> {
    const screen = await this.screenRepository.findById(screenId);
    if (!screen) {
      throw new WidgetError('Screen not found');
    }

    const solution = await this.solutionRepository.findById(screen.solutionId);
    if (!solution || solution.ownerId !== userId) {
      throw new WidgetError('Not authorized to view widgets', WidgetError.UNAUTHORIZED);
    }

    return this.widgetRepository.findByScreen(screenId);
  }

  async createWidget(widget: Omit<Widget, 'id'>, userId: string): Promise<Widget> {
    const screen = await this.screenRepository.findById(widget.screenId);
    if (!screen) {
      throw new WidgetError('Screen not found');
    }

    const solution = await this.solutionRepository.findById(screen.solutionId);
    if (!solution || solution.ownerId !== userId) {
      throw new WidgetError('Not authorized to create widget', WidgetError.UNAUTHORIZED);
    }

    // Validate widget position
    if (
      widget.position.x < 0 || 
      widget.position.y < 0 ||
      widget.position.x + widget.position.width > screen.layout.columns ||
      widget.position.y + widget.position.height > screen.layout.rows
    ) {
      throw new WidgetError('Invalid widget position or size', WidgetError.INVALID_POSITION);
    }

    const newWidget = await this.widgetRepository.create(widget);
    
    await this.screenRepository.update(widget.screenId, {
      widgetIds: [...screen.widgetIds, newWidget.id!]
    });

    return newWidget;
  }

  async updateWidget(id: string, userId: string, update: Partial<Widget>): Promise<Widget> {
    const widget = await this.widgetRepository.findById(id);
    if (!widget) {
      throw new WidgetError('Widget not found');
    }

    const screen = await this.screenRepository.findById(widget.screenId);
    if (!screen) {
      throw new WidgetError('Screen not found');
    }

    const solution = await this.solutionRepository.findById(screen.solutionId);
    if (!solution || solution.ownerId !== userId) {
      throw new WidgetError('Not authorized to update widget', WidgetError.UNAUTHORIZED);
    }

    if (update.position) {
      if (
        update.position.x < 0 ||
        update.position.y < 0 ||
        update.position.x + (update.position.width || widget.position.width) > screen.layout.columns ||
        update.position.y + (update.position.height || widget.position.height) > screen.layout.rows
      ) {
        throw new WidgetError('Invalid widget position or size', WidgetError.INVALID_POSITION);
      }
    }

    const updated = await this.widgetRepository.update(id, update);
    if (!updated) {
      throw new WidgetError('Failed to update widget', WidgetError.UPDATE_FAILED);
    }

    return updated;
  }

  async deleteWidget(id: string, userId: string): Promise<void> {
    const widget = await this.widgetRepository.findById(id);
    if (!widget) {
      throw new WidgetError('Widget not found');
    }

    const screen = await this.screenRepository.findById(widget.screenId);
    if (!screen) {
      throw new WidgetError('Screen not found');
    }

    const solution = await this.solutionRepository.findById(screen.solutionId);
    if (!solution || solution.ownerId !== userId) {
      throw new WidgetError('Not authorized to delete widget', WidgetError.UNAUTHORIZED);
    }

    const deleted = await this.widgetRepository.delete(id);
    if (!deleted) {
      throw new WidgetError('Failed to delete widget', WidgetError.DELETE_FAILED);
    }

    await this.screenRepository.update(widget.screenId, {
      widgetIds: screen.widgetIds.filter(widgetId => widgetId !== id)
    });
  }
}