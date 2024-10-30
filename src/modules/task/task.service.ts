import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateTaskDto, UpdateTaskDto } from './dto';
import { PaginationDto } from 'src/common';
import { SELECT_TASK_FIELDS } from './config';
import { Task } from './entities/task.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    this.validateDueDate(createTaskDto.dueDate);

    const newTask = await this.createTask(createTaskDto, user);
    const task = this.taskRepository.create(newTask);

    try {
      return await this.taskRepository.save(task);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async getAllTasks(user: User, paginationDto: PaginationDto) {
    const { offset = 0, limit = 10 } = paginationDto;

    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .select(SELECT_TASK_FIELDS.map((field) => `task.${field}`))
      .where('task.userId = :userId', { userId: user.id })
      .andWhere('task.isActive = :isActive', { isActive: true })
      .skip(offset)
      .take(limit)
      .getMany();

    return { userId: user.id, tasks };
  }

  async getTask(user: User, taskId: string) {
    const task = await this.findOneTask(user, taskId);
    if (!task.isActive)
      throw new NotFoundException(
        `Task with ID ${taskId}, not found or is inactive`,
      );

    return { userId: user.id, task };
  }

  async updateTask(user: User, taskId: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOneTask(user, taskId);
    if (!task.isActive)
      throw new NotFoundException(
        `Task with ID ${taskId}, not found or is inactive`,
      );

    if (updateTaskDto.dueDate)
      this.validateDueDate(updateTaskDto.dueDate, task.createAt);

    const updateTask = { ...task, ...updateTaskDto };

    try {
      return await this.taskRepository.save(updateTask);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async toggleTaskStatus(user: User, taskId: string) {
    const task = await this.findOneTask(user, taskId);

    const updatedTask = { ...task, isActive: !task.isActive };

    try {
      await this.taskRepository.save(updatedTask);
      return updatedTask;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  //? Private Methods
  private async findOneTask(user: User, taskId: string) {
    const taskWithUser = await this.taskRepository.findOne({
      where: { id: taskId, user: { id: user.id } },
      select: SELECT_TASK_FIELDS,
    });

    if (!taskWithUser) {
      throw new NotFoundException(`Task with ID ${taskId}, not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user: _, ...task } = taskWithUser;
    return task;
  }

  private async createTask(createTaskDto: CreateTaskDto, user: User) {
    return {
      ...createTaskDto,
      user,
    };
  }

  private validateDueDate(dueDateString: string, createAt?: Date): void {
    const dueDate = new Date(dueDateString);
    const currentDate = new Date();
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(currentDate.getFullYear() + 1);

    if (isNaN(dueDate.getTime())) {
      throw new BadRequestException('Invalid due date format');
    }

    if (!createAt && dueDate < currentDate) {
      throw new BadRequestException(
        'Due date cannot be earlier than current date',
      );
    }

    if (createAt && dueDate < createAt) {
      throw new BadRequestException(
        'Due date cannot be earlier than creation date',
      );
    }

    if (dueDate > maxFutureDate) {
      throw new BadRequestException(
        'Due date cannot be more than 1 year in the future',
      );
    }
  }

  private handleDatabaseError(error: Error): never {
    this.logger.error(error.message);
    throw new BadRequestException('Error saving task');
  }
}
