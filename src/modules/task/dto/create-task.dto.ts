import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Buy a new book',
    description: 'The title of the task',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Buy a new book about programming',
    description: 'The description of the task',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'OPEN',
    description: 'The status of the task (OPEN, IN_PROGRESS, DONE, EXPIRED)',
  })
  @IsIn(['OPEN', 'IN_PROGRESS', 'DONE', 'EXPIRED'])
  status: string;

  @ApiProperty({
    example: '2021-08-01T00:00:00.000Z',
    description: 'The due date of the task',
  })
  @IsDateString()
  dueDate: string;
}

export class UpdateStatusTaskDto {
  @ApiProperty({
    example: 'OPEN',
    description: 'The status of the task (OPEN, IN_PROGRESS, DONE, EXPIRED)',
  })
  @IsIn(['OPEN', 'IN_PROGRESS', 'DONE', 'EXPIRED'])
  status: string;
}
