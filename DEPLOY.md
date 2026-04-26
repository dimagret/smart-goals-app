# Руководство по деплою на Vercel

## Вариант 1: Через Vercel CLI (Быстрый)

### 1. Установка CLI
```bash
npm i -g vercel
```

### 2. Авторизация
```bash
vercel login
```

### 3. Деплой
```bash
cd smart-goals-app
vercel --prod
```

При первом запуске CLI задаст вопросы:
- **Set up and deploy?** → `Y`
- **Which scope?** → Выберите ваш аккаунт
- **Link to existing project?** → `N` (создать новый)
- **What's your project name?** → `smart-goals-app`
- **Which directory?** → `./` (текущая)

### 4. Настройка переменных окружения
После деплоя:
```bash
vercel env add DATABASE_URL
```
Введите: `file:./dev.db`

Или через Dashboard:
1. Перейдите в [Dashboard](https://vercel.com/dashboard)
2. Выберите проект
3. Settings → Environment Variables
4. Добавьте `DATABASE_URL` = `file:./dev.db`

### 5. Пересборка
```bash
vercel --prod
```

---

## Вариант 2: Через Git (Рекомендуется)

### 1. Создание репозитория
```bash
cd smart-goals-app
git init
git add .
git commit -m "Initial commit"
```

### 2. Создание репозитория на GitHub/GitLab
```bash
# GitHub
gh repo create smart-goals-app --public --source=. --push

# Или вручную:
git remote add origin https://github.com/ВАШ_ЮЗЕРНЕЙМ/smart-goals-app.git
git branch -M main
git push -u origin main
```

### 3. Импорт в Vercel
1. Перейдите на [vercel.com/new](https://vercel.com/new)
2. Импортируйте свой репозиторий
3. Настройки:
   - **Framework Preset:** Next.js
   - **Build Command:** `prisma generate && prisma migrate deploy && next build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

### 4. Environment Variables
Добавьте в интерфейсе Vercel:
- `DATABASE_URL` = `file:./dev.db`

### 5. Деплой
Нажмите **Deploy** и дождитесь завершения.

---

## Вариант 3: Для Production (PostgreSQL)

Для production рекомендуется PostgreSQL вместо SQLite:

### 1. Создание БД на Vercel
1. Перейдите в [Vercel Storage](https://vercel.com/dashboard/stores)
2. Создайте **Postgres** базу
3. Скопируйте `POSTGRES_URL`

### 2. Обновление переменных
```bash
vercel env add DATABASE_URL
# Введите POSTGRES_URL
```

### 3. Обновление Prisma schema
Измените в `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 4. Пересборка
```bash
vercel --prod
```

---

## Устранение неполадок

### Ошибка: "Prisma Client не найден"
**Решение:** Убедитесь, что `postinstall` скрипт есть в `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Ошибка: "Database file not found"
**Решение:** Для SQLite на Vercel используйте `/tmp`:
```env
DATABASE_URL="file:/tmp/dev.db"
```

**Или** переключитесь на PostgreSQL (рекомендуется).

### Ошибка: "Migration failed"
**Решение:** Выполните миграции вручную:
```bash
vercel --prod
# Затем в Dashboard посмотрите логи билда
```

---

## После деплоя

### Доступ к приложению
URL будет вида: `https://smart-goals-app-ВАШ_ЮЗЕРНЕЙМ.vercel.app`

### Демо-данные
Для заполнения демо-данными:
```bash
# Локально
npm run db:seed

# На Vercel (через Functions)
# Добавьте API endpoint для сида или используйте Prisma Studio локально
```

### Мониторинг
- **Analytics:** Встроенная аналитика Vercel
- **Logs:** Dashboard → Deployments → Logs
- **Performance:** Core Web Vitals в Dashboard

---

## Дополнительно

### Настройка домена
1. Dashboard → Project → Settings → Domains
2. Добавьте свой домен
3. Следуйте инструкциям по настройке DNS

### Включение Analytics
```bash
vercel analytics enable
```

### Включение Speed Insights
```bash
vercel speed-insights enable
```

---

**Готово! Ваше SMART Goals приложение задеплоено.**