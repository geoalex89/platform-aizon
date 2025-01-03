export type WidgetType = 'bar' | 'pie' | 'line' | 'image';

export interface Widget {
  id?: string;
  name: string;
  type: WidgetType;
  screenId: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}