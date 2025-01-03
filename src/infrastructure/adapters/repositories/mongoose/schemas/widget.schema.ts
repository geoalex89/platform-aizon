import mongoose from 'mongoose';
import { Widget } from '../../../../../domain/entities/widget.entity';

const widgetSchema = new mongoose.Schema<Widget>({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['bar', 'pie', 'line', 'image'],
    required: true 
  },
  screenId: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  config: { type: mongoose.Schema.Types.Mixed, required: true }
}, { 
  timestamps: true 
});

export const WidgetModel = mongoose.model<Widget>('Widget', widgetSchema);