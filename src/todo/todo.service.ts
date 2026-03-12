import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { Repository } from 'typeorm';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepo: Repository<Todo>,
  ) {}

  FindAll(userID: number) {
    return this.todoRepo.find({ where: { userID } });
  }

  async findOne(id: number, userID: number) {
    const todo = await this.todoRepo.findOne({ where: { userID } });
    if (!todo) throw new NotFoundException('ЗАдача не найдена ! ');
    if (todo.userID !== userID) throw new NotFoundException('нет доступа');
    return todo;
  }

  create(dto: CreateTodoDto, userID: number) {
    const todo = this.todoRepo.create({ ...dto, userID });
    return this.todoRepo.save(todo);
  }

  async update(id: number, dto: UpdateTodoDto, userID: number) {
    const todo = await this.findOne(id, userID);
    Object.assign(todo, dto);
    return this.todoRepo.save(todo);
  }

  async remove(id: number, userID: number) {
    const todo = await this.findOne(id, userID);
    await this.todoRepo.remove(todo);
    return { message: 'задача удалена' };
  }
}
