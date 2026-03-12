import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Collection,
} from 'typeorm';
import { Todo } from '../todo/todo.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
