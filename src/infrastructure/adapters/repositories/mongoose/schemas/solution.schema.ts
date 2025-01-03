import mongoose from 'mongoose';
import { Solution } from '../../../../../domain/entities/solution.entity';

const solutionSchema = new mongoose.Schema<Solution>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ownerId: { type: String, required: true },
  screenIds: [{ type: String }]
}, { 
  timestamps: true 
});

export const SolutionModel = mongoose.model<Solution>('Solution', solutionSchema);