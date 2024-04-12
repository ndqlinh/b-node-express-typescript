import { v4 as uuidv4 } from 'uuid';
import { getCurrentTime } from '../shared/utils/datetime.utils';

export class Model {
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;

  constructor() {
    this.id = uuidv4();
    this.createdAt = getCurrentTime();
  }
}
