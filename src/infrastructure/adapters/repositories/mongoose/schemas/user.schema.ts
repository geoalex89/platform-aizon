import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../../../../../domain/entities/user.entity';

const userSchema = new mongoose.Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { 
  timestamps: true 
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const UserModel = mongoose.model<User>('User', userSchema);