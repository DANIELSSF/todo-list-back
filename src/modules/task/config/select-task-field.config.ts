import { Task } from 'src/modules/task/entities/task.entity';

export const SELECT_TASK_FIELDS: (keyof Task)[] = [
  'id',
  'title',
  'description',
  'status',
  'dueDate',
  'createAt',
  'updateAt',
  'isActive',
];
