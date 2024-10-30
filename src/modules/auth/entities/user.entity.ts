import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Task } from 'src/modules/task/entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user' })
export class User {
  @ApiProperty({
    example: 'd7de20a4-cfb7-4d41-99fa-5ea25090971e',
    description: 'The id of the User',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'daniel@google.com',
  })
  @Column('text', { unique: true })
  email: string;

  @ApiProperty({
    example: 'Abc123',
  })
  @Column('text', { select: false })
  password: string;

  @ApiProperty({
    example: 'Daniel Silva',
  })
  @Column('text')
  fullName: string;

  @ApiProperty({
    example: true,
    default: true,
  })
  @Column('bool', { default: true })
  isActive: boolean;

  @ApiProperty({
    example: ['user'],
    default: ['user'],
  })
  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @ApiProperty({
    example: '2021-08-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createAt: Date;

  @ApiProperty({ example: '2021-08-01T00:00:00.000Z' })
  @UpdateDateColumn()
  updateAt: Date;

  // Todo: relation of task
  @OneToMany(() => Task, (task) => task.user)
  task: Task[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
