import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn(() => 'mock-token') },
        },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  // ───── Базовый тест ─────
  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  // ───── Тесты register ─────
  describe('register', () => {
    it('успешно создаёт пользователя', async () => {
      mockUserRepo.findOne.mockResolvedValue(null); // пользователь не существует
      mockUserRepo.create.mockReturnValue({ email: 'test@test.com' });
      mockUserRepo.save.mockResolvedValue({ id: 1, email: 'test@test.com' });

      const result = await service.register({
        email: 'test@test.com',
        password: '123456',
      });

      expect(result).toEqual({ message: 'Пользователь создан' });
    });

    it('выбрасывает ошибку если email уже занят', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1, email: 'test@test.com' }); // пользователь уже есть

      await expect(
        service.register({
          email: 'test@test.com',
          password: '123456',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ───── Тесты login ─────
  describe('login', () => {
    it('успешно возвращает токен', async () => {
      mockUserRepo.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: await require('bcrypt').hash('123456', 10),
      });

      const result = await service.login({
        email: 'test@test.com',
        password: '123456',
      });

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mock-token');
    });

    it('выбрасывает ошибку если пользователь не найден', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'wrong@test.com',
          password: '123456',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('выбрасывает ошибку если пароль неверный', async () => {
      mockUserRepo.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: await require('bcrypt').hash('правильный-пароль', 10),
      });

      await expect(
        service.login({
          email: 'test@test.com',
          password: 'неверный-пароль',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
