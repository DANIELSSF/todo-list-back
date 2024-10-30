import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
