import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/modules/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'task' })
export class Task {
  @ApiProperty({
    example: 'd7de20a4-cfb7-4d41-99fa-5ea25090971e',
    description: 'The id of the User',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Buy a new book',
    description: 'The title of the task',
  })
  @Column('text')
  title: string;

  @ApiProperty({
    example: 'Buy a new book about programming',
    description: 'The description of the task',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    example: 'To Do',
    description: 'The status of the task',
    default: 'OPEN',
  })
  @Column('text', { default: 'OPEN' })
  status: string;

  @ApiProperty({
    example: '2021-08-01T00:00:00.000Z',
    description: 'The due date of the task',
  })
  @Column('timestamp')
  dueDate: Date;

  @ApiProperty({
    example: '2021-08-01T00:00:00.000Z',
    description: 'The create date of the task',
  })
  @CreateDateColumn()
  createAt: Date;

  @ApiProperty({
    example: '2021-08-01T00:00:00.000Z',
    description: 'The update date of the task',
  })
  @UpdateDateColumn()
  updateAt: Date;

  @ApiProperty({
    example: true,
    default: true,
    description: 'The status of the task',
  })
  @Column('bool', { default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.task, { eager: true })
  user: User;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.title = this.title.trim();
    this.description = this.description.trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
