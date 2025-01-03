import { Widget } from '../../../../domain/entities/widget.entity';
import { WidgetRepository } from '../../../../domain/ports/repositories/widget.repository';
import { WidgetModel } from './schemas/widget.schema';

export class MongoWidgetRepository implements WidgetRepository {
  async findById(id: string): Promise<Widget | null> {
    return WidgetModel.findById(id);
  }

  async findByScreen(screenId: string): Promise<Widget[]> {
    return WidgetModel.find({ screenId });
  }

  async create(widget: Widget): Promise<Widget> {
    return WidgetModel.create(widget);
  }

  async update(id: string, widget: Partial<Widget>): Promise<Widget | null> {
    return WidgetModel.findByIdAndUpdate(id, widget, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await WidgetModel.findByIdAndDelete(id);
    return !!result;
  }
}