import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  findAll(@Request() req) {
    return this.todoService.FindAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.todoService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateTodoDto, @Request() req) {
    return this.todoService.create(dto, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
    @Request() req,
  ) {
    return this.todoService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.todoService.remove(id, req.user.id);
  }
}
