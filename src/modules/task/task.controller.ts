import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  ParseUUIDPipe,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth, GetUser } from '../auth/decorators';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { PaginationDto } from 'src/common';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/enums';

@ApiTags('Task')
@Controller('task')
@Auth(ValidRoles.USER)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiResponse({ status: 201, description: 'Task Created', type: Task })
  @ApiResponse({ status: 400, description: 'Due Date invalid' })
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.taskService.create(createTaskDto, user);
  }

  @ApiResponse({ status: 200, description: 'Tasks Retrieved', type: [Task] })
  @Get()
  getTasks(@GetUser() user: User, @Query() paginationDto: PaginationDto) {
    return this.taskService.getAllTasks(user, paginationDto);
  }

  @ApiResponse({ status: 200, description: 'Task Retrieved', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @Get(':id')
  getTask(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.getTask(user, id);
  }

  @ApiResponse({ status: 200, description: 'Task Updated', type: Task })
  @ApiResponse({ status: 400, description: 'Due Date invalid' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @Put(':id')
  updateTask(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(user, id, updateTaskDto);
  }

  @ApiResponse({ status: 200, description: 'Task Deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @Delete(':id')
  toggleTaskStatus(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.taskService.toggleTaskStatus(user, id);
  }
}
