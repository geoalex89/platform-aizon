export interface Solution {
  id?: string;
  name: string;
  description: string;
  ownerId: string;
  screenIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}