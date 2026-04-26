#!/bin/bash

# Скрипт деплоя на Vercel (Mac/Linux)
# Запуск: chmod +x deploy-vercel.sh && ./deploy-vercel.sh

echo -e "\033[36m=========================================="
echo -e "SMART Goals App - Vercel Deploy Script"
echo -e "==========================================\033[0m"
echo ""

# Проверка наличия Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "\033[33mVercel CLI не найден. Устанавливаю...\033[0m"
    npm install -g vercel
    
    if [ $? -ne 0 ]; then
        echo -e "\033[31mОшибка установки Vercel CLI. Установите вручную: npm i -g vercel\033[0m"
        exit 1
    fi
fi

# Проверка git
if ! command -v git &> /dev/null; then
    echo -e "\033[31mGit не найден. Установите Git: https://git-scm.com/downloads\033[0m"
    exit 1
fi

# Проверка .env файла
if [ ! -f ".env" ]; then
    echo -e "\033[33mФайл .env не найден. Создаю из .env.example...\033[0m"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "\033[33m.env создан. Пожалуйста, отредактируйте его и запустите скрипт снова.\033[0m"
        echo -e "\033[36mВажно: установите NEXTAUTH_SECRET с помощью команды: openssl rand -base64 32\033[0m"
        exit 0
    else
        echo -e "\033[31m.env.example не найден!\033[0m"
        exit 1
    fi
fi

# Проверка node_modules
if [ ! -d "node_modules" ]; then
    echo -e "\033[33mУстановка зависимостей...\033[0m"
    npm install
    
    if [ $? -ne 0 ]; then
        echo -e "\033[31mОшибка установки зависимостей\033[0m"
        exit 1
    fi
fi

# Проверка git репозитория
if [ ! -d ".git" ]; then
    echo -e "\033[33mИнициализация Git репозитория...\033[0m"
    git init
    git add .
    git commit -m "Initial commit for Vercel deploy"
fi

# Авторизация в Vercel
echo ""
echo -e "\033[36mПроверка авторизации в Vercel...\033[0m"
vercel whoami

if [ $? -ne 0 ]; then
    echo -e "\033[33mТребуется авторизация...\033[0m"
    vercel login
fi

# Запрос URL для NEXTAUTH_URL
echo ""
read -p "Введите название проекта (например, smart-goals-app): " projectName
nextauthUrl="https://$projectName.vercel.app"

# Обновление .env
echo ""
echo -e "\033[36mОбновление .env файла...\033[0m"

# Удаляем старый NEXTAUTH_URL если есть
sed -i '' '/NEXTAUTH_URL=/d' .env

# Добавляем новый NEXTAUTH_URL
echo "NEXTAUTH_URL=$nextauthUrl" >> .env

echo -e "\033[32mNEXTAUTH_URL установлен: $nextauthUrl\033[0m"
echo ""

# Деплой
echo -e "\033[32mЗапуск деплоя...\033[0m"
echo ""

vercel --prod --yes

if [ $? -eq 0 ]; then
    echo ""
    echo -e "\033[32m=========================================="
    echo -e "Деплой успешно запущен!"
    echo -e "==========================================\033[0m"
    echo ""
    echo -e "\033[36mВаше приложение будет доступно по адресу:\033[0m"
    echo -e "\033[37m$nextauthUrl\033[0m"
    echo ""
    echo -e "\033[33mВажно: После деплоя добавьте Environment Variables в Vercel Dashboard:\033[0m"
    echo -e "\033[37m1. Перейдите в Project Settings → Environment Variables\033[0m"
    echo -e "\033[37m2. Добавьте:\033[0m"
    echo -e "\033[37m   DATABASE_URL = file:/tmp/dev.db\033[0m"
    echo -e "\033[37m   NEXTAUTH_SECRET = $(grep NEXTAUTH_SECRET .env | cut -d '=' -f2)\033[0m"
    echo -e "\033[37m   NEXTAUTH_URL = $nextauthUrl\033[0m"
    echo ""
    echo -e "\033[37m3. Пересоберите проект: vercel --prod\033[0m"
else
    echo ""
    echo -e "\033[31m=========================================="
    echo -e "Ошибка деплоя!"
    echo -e "==========================================\033[0m"
    echo ""
    echo -e "\033[33mПроверьте логи выше или попробуйте вручную:\033[0m"
    echo -e "\033[37mvercel --prod\033[0m"
fi