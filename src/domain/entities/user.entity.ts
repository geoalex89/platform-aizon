export interface User {
  id?: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}