import { Widget } from '../../entities/widget.entity';

export interface WidgetRepository {
  findById(id: string): Promise<Widget | null>;
  findByScreen(screenId: string): Promise<Widget[]>;
  create(widget: Widget): Promise<Widget>;
  update(id: string, widget: Partial<Widget>): Promise<Widget | null>;
  delete(id: string): Promise<boolean>;
}