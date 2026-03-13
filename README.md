# Todo List API

NestJS + TypeORM + PostgreSQL + JWT

## Запуск

1. Установить зависимости: `npm install`
2. Создать `.env` файл (см. `.env.example`)
3. Запустить: `npm run start:dev`

## Эндпоинты

| Метод  | URL            | Описание    |
| ------ | -------------- | ----------- |
| POST   | /auth/register | Регистрация |
| POST   | /auth/login    | Вход        |
| GET    | /todos         | Все задачи  |
| GET    | /todos/:id     | Одна задача |
| POST   | /todos         | Создать     |
| PATCH  | /todos/:id     | Обновить    |
| DELETE | /todos/:id     | Удалить     |

```

```

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=
DB_NAME=todoapp
JWT_SECRET=
