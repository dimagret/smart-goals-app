# 🚀 ПОШАГОВАЯ ИНСТРУКЦИЯ: Деплой на Vercel (Ручной)

## Часть 1: Подготовка проекта

### Шаг 1.1: Откройте PowerShell
Нажмите `Win + X` → выберите **Windows PowerShell** или **Terminal**

### Шаг 1.2: Перейдите в папку проекта
```powershell
cd C:\Users\Имя_Пользователя\Documents\kimi\smart-goals-app
```

### Шаг 1.3: Создайте файл .env
```powershell
Copy-Item .env.example .env
```

### Шаг 1.4: Сгенерируйте секретный ключ
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
**Скопируйте полученный ключ** (длинная строка символов)

### Шаг 1.5: Отредактируйте .env
Откройте файл `.env` в блокноте:
```powershell
notepad .env
```

Замените содержимое на:
```
DATABASE_URL="file:/tmp/dev.db"
NEXTAUTH_URL="https://smart-goals-app.vercel.app"
NEXTAUTH_SECRET="ВАШ_СКОПИРОВАННЫЙ_КЛЮЧ_ИЗ_ШАГА_1.4"
```

Сохраните и закройте.

### Шаг 1.6: Залейте проект на GitHub
```powershell
git add -A
git commit -m "ready for vercel deploy"
```

Теперь нужно создать репозиторий на GitHub:

**Вариант A (через браузер):**
1. Перейдите на https://github.com/new
2. Repository name: `smart-goals-app`
3. Выберите **Public**
4. Нажмите **Create repository**
5. Скопируйте команду под заголовком "...or push an existing repository from the command line"

**Вариант B (через GitHub Desktop):**
- Если установлен GitHub Desktop, просто добавьте папку

В PowerShell выполните:
```powershell
git remote add origin https://github.com/ВАШ_НИКНЕЙМ/smart-goals-app.git
git branch -M main
git push -u origin main
```

**Введите логин и пароль от GitHub** (или токен, если требуется)

---

## Часть 2: Создание аккаунта на Vercel

### Шаг 2.1: Перейдите на сайт
Откройте браузер и зайдите на: **https://vercel.com**

### Шаг 2.2: Регистрация
1. Нажмите кнопку **Sign Up** (в правом верхнем углу)
2. Выберите **Continue with GitHub** (рекомендуется)
3. Авторизуйтесь через GitHub
4. Разрешите Vercel доступ к вашим репозиториям
5. Заполните имя команды (можно просто нажать Continue)

---

## Часть 3: Импорт проекта

### Шаг 3.1: Стартовая страница
После входа вы увидите Dashboard.

### Шаг 3.2: Создание нового проекта
1. Нажмите большую кнопку **Add New...** (синяя, справа сверху)
2. Выберите **Project** из выпадающего меню

### Шаг 3.3: Импорт из GitHub
1. В разделе **Import Git Repository** найдите `smart-goals-app`
2. Нажмите кнопку **Import** рядом с репозиторием

Если репозиторий не виден:
- Нажмите **Adjust GitHub App Permissions**
- Выберите свой аккаунт
- Нажмите **Select All**
- Нажмите **Save**
- Вернитесь назад и обновите страницу

### Шаг 3.4: Настройка проекта
Вы увидите форму с настройками:

**Project Name:** `smart-goals-app` (или оставьте как есть)

**Framework Preset:** Должен автоматически определиться как **Next.js**

**Build Command:** 
```
prisma generate && next build
```

**Output Directory:** `.next` (по умолчанию)

**Install Command:** `npm install` (по умолчанию)

### Шаг 3.5: Environment Variables
ПРОКРУТИТЕ ВНИЗ до раздела **Environment Variables**

Нажмите кнопку **Add** 3 раза и добавьте:

**Переменная 1:**
- Name: `DATABASE_URL`
- Value: `file:/tmp/dev.db`

**Переменная 2:**
- Name: `NEXTAUTH_SECRET`
- Value: `ВАШ_КЛЮЧ_ИЗ_ШАГА_1.4`

**Переменная 3:**
- Name: `NEXTAUTH_URL`
- Value: `https://smart-goals-app.vercel.app`

**Важно:** Для SQLite на Vercel используем `file:/tmp/dev.db` (не `file:./dev.db`)

### Шаг 3.6: Деплой
1. Нажмите кнопку **Deploy** (большая синяя)
2. Ждите 2-3 минуты (вы увидите логи сборки)
3. Когда увидите **Congratulations!** — деплой успешен!

---

## Часть 4: Проверка и настройка

### Шаг 4.1: Откройте ваше приложение
Нажмите на появившуюся ссылку или перейдите по адресу:
`https://smart-goals-app.vercel.app`

### Шаг 4.2: Проверьте работу
1. Зарегистрируйтесь (Sign Up)
2. Создайте тестовую цель
3. Убедитесь, что всё работает

### Шаг 4.3: Если нужно изменить настройки
1. Перейдите в Dashboard Vercel
2. Выберите проект `smart-goals-app`
3. Перейдите во вкладку **Settings** (сверху)

---

## Часть 5: Обновление приложения (после изменений)

Если вы внесли изменения в код:

### Шаг 5.1: Сохраните изменения
```powershell
git add -A
git commit -m "обновление"
git push origin main
```

### Шаг 5.2: Автоматический редеплой
Vercel автоматически пересоберет проект при пуше в main!

Или вручную:
1. Dashboard → ваш проект
2. Вкладка **Deployments**
3. Нажмите на последний деплой
4. Нажмите кнопку **Redeploy**

---

## 🔧 УСТРАНЕНИЕ ПРОБЛЕМ

### Проблема: "Build Failed"
**Решение:**
1. Dashboard → ваш проект → последний деплой
2. Нажмите на **Build Logs**
3. Найдите красную ошибку
4. Скопируйте текст ошибки и отправьте мне

### Проблема: "Database not found"
**Решение:**
1. Settings → Environment Variables
2. Проверьте что `DATABASE_URL` = `file:/tmp/dev.db`
3. Нажмите **Redeploy**

### Проблема: "Unauthorized" при входе
**Решение:**
1. Settings → Environment Variables
2. Проверьте `NEXTAUTH_SECRET` и `NEXTAUTH_URL`
3. Убедитесь что `NEXTAUTH_URL` соответствует реальному домену
4. Нажмите **Redeploy**

---

## 📱 ГОТОВО!

Ваше приложение SMART Goals теперь доступно онлайн!

**URL:** `https://smart-goals-app.vercel.app`

**Демо-данные:**
- Email: `demo@example.com`
- Password: `password123`

Если что-то не работает — пришлите скриншот или текст ошибки из Build Logs!