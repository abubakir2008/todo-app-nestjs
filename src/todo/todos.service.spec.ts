import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './todo.entity';

describe('TodosService', () => {
  let service: TodoService;

  const mockTodoRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: getRepositoryToken(Todo), useValue: mockTodoRepo },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  it('findAll возвращает список задач', async () => {
    mockTodoRepo.find.mockResolvedValue([{ id: 1, title: 'Тест' }]);
    const todos = await service.FindAll(1);
    expect(todos).toHaveLength(1);
  });

  it('create создаёт задачу', async () => {
    mockTodoRepo.create.mockReturnValue({ title: 'Новая задача' });
    mockTodoRepo.save.mockResolvedValue({ id: 1, title: 'Новая задача' });

    const todo = await service.create({ title: 'Новая задача' }, 1);
    expect(todo).toHaveProperty('id');
  });
  it('delete удаляет задачу', async () => {
    const todo = { id: 1, title: 'Тест', userID: 1 };
    mockTodoRepo.findOne.mockResolvedValue(todo);
    mockTodoRepo.remove.mockResolvedValue(todo); // ← теперь remove

    const result = await service.delete(1, 1);
    expect(result).toEqual({ message: 'задача удалена' });
  });
});
