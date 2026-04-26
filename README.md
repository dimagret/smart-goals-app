# SMART Goals App

Профессиональное приложение для SMART-планирования целей с трекингом прогресса, авторизацией, графиками и темной темой.

## Функции

- **SMART-формат** — структурированное создание целей по методологии
- **Авторизация** — регистрация и вход через email/password
- **Темная тема** — автоматическое переключение светлой/темной темы
- **Графики** — визуализация прогресса, категорий и статусов
- **Трекинг** — визуальные индикаторы и статистика
- **Подзадачи** — разбивка целей на конкретные шаги
- **Чек-ины** — ежедневная фиксация прогресса
- **Дашборд** — обзор всех целей и метрик
- **Категории** — работа, здоровье, обучение, финансы, личное

## Технологии

- Next.js 14 (App Router)
- TypeScript
- Prisma + SQLite
- Tailwind CSS
- shadcn/ui
- NextAuth.js (Credentials Provider)
- Recharts (графики)
- next-themes (темная тема)

## Быстрый старт

```bash
# 1. Установка зависимостей
npm install

# 2. Настройка переменных окружения
cp .env.example .env

# 3. Генерация Prisma Client
npx prisma generate

# 4. Создание и применение миграций
npx prisma migrate dev --name init

# 5. (Опционально) Заполнение демо-данными
npm run db:seed

# 6. Запуск dev-сервера
npm run dev
```

Приложение доступно по адресу: `http://localhost:3000`

### Демо-данные

После сида:
- **Email:** `demo@example.com`
- **Пароль:** `password123`

## Деплой на Vercel

### 1. Подготовка

Убедитесь, что у вас есть:
- Аккаунт на [Vercel](https://vercel.com)
- Установленный [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`

### 2. Переменные окружения

Создайте файл `.env.local`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Для production сгенерируйте секрет:
```bash
openssl rand -base64 32
```

### 3. Деплой через CLI

```bash
vercel login
vercel --prod
```

### 4. Деплой через Git

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create smart-goals-app --public --source=. --push
```

Затем импортируйте на [vercel.com/new](https://vercel.com/new)

### 5. Настройка в Dashboard

1. Перейдите в Project Settings
2. Добавьте Environment Variables:
   - `DATABASE_URL` = `file:./dev.db`
   - `NEXTAUTH_SECRET` = ваш секрет
   - `NEXTAUTH_URL` = ваш домен (например, `https://your-app.vercel.app`)

## Структура проекта

```
smart-goals-app/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Защищенные роуты
│   │   ├── dashboard/      # Главная страница
│   │   └── goals/          # Цели
│   ├── api/               # API endpoints
│   │   ├── auth/          # NextAuth + регистрация
│   │   ├── goals/         # CRUD для целей
│   │   └── checkins/      # Чек-ины
│   ├── auth/              # Страницы авторизации
│   └── layout.tsx         # Корневой layout
├── components/            # React компоненты
│   ├── ui/               # shadcn/ui
│   ├── GoalCharts.tsx    # Графики (Recharts)
│   ├── ThemeToggle.tsx   # Переключатель темы
│   └── providers.tsx     # SessionProvider
├── lib/                  # Утилиты
│   ├── auth.ts          # NextAuth конфиг
│   ├── session.ts       # Проверка сессии
│   └── prisma.ts        # Prisma Client
├── prisma/
│   ├── schema.prisma    # Схема БД
│   └── seed.ts          # Демо-данные
└── types/
    └── next-auth.d.ts   # Типы для NextAuth
```

## API Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/signin` | Вход (NextAuth) |
| GET | `/api/goals` | Список целей |
| POST | `/api/goals` | Создание цели |
| GET | `/api/goals/:id` | Получение цели |
| PUT | `/api/goals/:id` | Обновление цели |
| DELETE | `/api/goals/:id` | Удаление цели |
| POST | `/api/checkins` | Создание чек-ина |

## Разработка

### Добавление новой цели
1. Войдите в систему
2. Перейдите в раздел "Новая цель"
3. Заполните все 5 полей SMART
4. Добавьте подзадачи
5. Нажмите "Создать SMART цель"

### Ежедневный чек-ин
1. Откройте страницу цели
2. Нажмите кнопку "Чек-ин"
3. Укажите текущий прогресс и заметки
4. Сохраните

### Переключение темы
- Нажмите иконку луны/солнца в правом верхнем углу
- Тема сохраняется автоматически

## Дорожная карта

- [x] Базовая структура и UI
- [x] CRUD для целей
- [x] Подзадачи
- [x] Система чек-инов
- [x] Дашборд со статистикой
- [x] **Авторизация (NextAuth.js)**
- [x] **Графики прогресса (Recharts)**
- [x] **Темная тема**
- [ ] Email-напоминания
- [ ] Экспорт данных
- [ ] PWA (Progressive Web App)

## Лицензия

MIT — свободное использование и модификация.

---

**Создано для достижения целей по методологии SMART.**