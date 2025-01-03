import mongoose from 'mongoose';
import { Screen } from '../../../../../domain/entities/screen.entity';

const screenSchema = new mongoose.Schema<Screen>({
  name: { type: String, required: true },
  solutionId: { type: String, required: true },
  layout: {
    columns: { type: Number, required: true, default: 12 },
    rows: { type: Number, required: true, default: 12 }
  },
  widgetIds: [{ type: String }]
}, { 
  timestamps: true 
});

export const ScreenModel = mongoose.model<Screen>('Screen', screenSchema);