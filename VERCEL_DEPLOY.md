# Деплой на Vercel — Полное руководство

## Вариант 1: GitHub + Vercel Dashboard (Рекомендуется) ⭐

### Шаг 1: Создать репозиторий на GitHub

```bash
# В папке проекта
cd smart-goals-app

# Инициализация git (если еще не сделано)
git init

# Добавить все файлы
git add .

# Коммит
git commit -m "feat: SMART Goals app ready for production"

# Создать репозиторий на GitHub (через gh CLI или вручную на github.com)
# Если gh установлен:
gh repo create smart-goals-app --public --source=. --push

# Или вручную:
git remote add origin https://github.com/ВАШ_ЮЗЕРНЕЙМ/smart-goals-app.git
git branch -M main
git push -u origin main
```

### Шаг 2: Импортировать проект на Vercel

1. Перейдите на [vercel.com/new](https://vercel.com/new)
2. Войдите в аккаунт (можно через GitHub — удобнее всего)
3. Найдите и выберите репозиторий `smart-goals-app`
4. Нажмите **Import**

### Шаг 3: Настройка проекта

В интерфейсе настройки:

**Project Name:** `smart-goals-app` (или любое другое)

**Framework Preset:** Next.js (должен определиться автоматически)

**Build Command:** 
```
prisma generate && next build
```

**Output Directory:** `.next` (по умолчанию)

**Install Command:** `npm install` (по умолчанию)

### Шаг 4: Environment Variables

Нажмите кнопку **Environment Variables** и добавьте:

```
DATABASE_URL = file:/tmp/dev.db
NEXTAUTH_SECRET = ваш_секретный_ключ
NEXTAUTH_URL = https://your-project.vercel.app
```

**Генерация NEXTAUTH_SECRET:**
```bash
# В терминале выполните:
openssl rand -base64 32
# Или онлайн: https://generate-secret.vercel.app/32
```

**Важно:** Для SQLite на Vercel используйте `file:/tmp/dev.db` (не `file:./dev.db`), потому что файловая система Vercel ephemeral.

### Шаг 5: Deploy

Нажмите **Deploy** и ждите 2-3 минуты.

---

## Вариант 2: Vercel CLI

### Предварительные требования
- Установленный [Vercel CLI](https://vercel.com/docs/cli)
- Аккаунт на Vercel

```bash
# Установка CLI
npm i -g vercel

# Авторизация (откроется браузер)
vercel login

# Переход в папку проекта
cd smart-goals-app

# Запуск деплоя
vercel --prod
```

При первом запуске CLI задаст вопросы:
- **Set up and deploy?** → `Y`
- **Which scope?** → Выберите ваш аккаунт
- **Link to existing project?** → `N`
- **Project name:** `smart-goals-app`
- **Directory:** `./` (жмите Enter)

### Добавление переменных окружения

```bash
vercel env add DATABASE_URL
# Введите: file:/tmp/dev.db

vercel env add NEXTAUTH_SECRET
# Введите ваш секрет

vercel env add NEXTAUTH_URL
# Введите ваш URL
```

### Пересборка

```bash
vercel --prod
```

---

## Вариант 3: PostgreSQL для Production (Рекомендуется для реального использования)

SQLite на Vercel имеет ограничение: данные могут пропадать между деплоями.

### Создание PostgreSQL базы

1. В [Vercel Dashboard](https://vercel.com/dashboard) перейдите во вкладку **Storage**
2. Нажмите **Create Database** → **Postgres**
3. Выберите регион (ближайший к вам)
4. Нажмите **Create**
5. Скопируйте значение `POSTGRES_URL`

### Обновление переменных

```bash
vercel env add DATABASE_URL
# Введите POSTGRES_URL из Vercel Storage
```

### Обновление Prisma schema

В файле `prisma/schema.prisma` измените:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Применение миграций

```bash
# Локально
dotenv -e .env.production -- npx prisma migrate deploy

# Или через Vercel CLI
vercel --prod
```

---

## Устранение неполадок

### Ошибка: "Prisma Client not found"

**Решение:** Проверьте `postinstall` в package.json:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Ошибка: "Database file not found" или данные пропадают

**Решение:** Для SQLite используйте путь `/tmp`:
```env
DATABASE_URL="file:/tmp/dev.db"
```

**Или перейдите на PostgreSQL** (см. Вариант 3).

### Ошибка: "NEXTAUTH_URL missing"

**Решение:** Добавьте переменную:
```env
NEXTAUTH_URL="https://your-project.vercel.app"
```

Узнать URL можно в Dashboard → Project → Domains.

### Ошибка: "Unauthorized" после деплоя

**Решение:** Проверьте:
1. `NEXTAUTH_SECRET` установлен
2. `NEXTAUTH_URL` соответствует реальному домену
3. Cookie настроены корректно

---

## После деплоя

### Доступ к приложению
URL будет вида: `https://smart-goals-app-ВАШ_ЮЗЕРНЕЙМ.vercel.app`

### Заполнение демо-данных

Для PostgreSQL:
```bash
# Локально с production БД
DATABASE_URL="your-postgres-url" npx prisma db seed
```

Для SQLite данные создадутся автоматически при первом запросе.

### Настройка домена

1. Dashboard → Project → Settings → Domains
2. Добавьте свой домен (например, `goals.yourdomain.com`)
3. Следуйте инструкциям по настройке DNS

### Включение Analytics

1. Dashboard → Project → Analytics
2. Нажмите **Enable**

---

## Быстрые команды

```bash
# Локальная разработка
npm run dev

# Создание миграции
npx prisma migrate dev --name название

# Применение миграций на production
npx prisma migrate deploy

# Просмотр БД
npx prisma studio

# Деплой
vercel --prod

# Логи
vercel logs --prod
```

---

## Чек-лист перед деплоем

- [ ] Все изменения закоммичены
- [ ] `.env` не попал в git (проверьте `.gitignore`)
- [ ] `NEXTAUTH_SECRET` сгенерирован
- [ ] `DATABASE_URL` настроен
- [ ] Тесты проходят локально
- [ ] Билд проходит без ошибок (`npm run build`)

---

**Готово к деплою!** Если возникнут проблемы — присылайте логи, помогу разобраться.