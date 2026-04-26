# Скрипт деплоя на Vercel (Windows PowerShell)
# Запуск: .\deploy-vercel.ps1

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "SMART Goals App - Vercel Deploy Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка наличия Vercel CLI
$vercelPath = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelPath) {
    Write-Host "Vercel CLI не найден. Устанавливаю..." -ForegroundColor Yellow
    npm install -g vercel
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Ошибка установки Vercel CLI. Установите вручную: npm i -g vercel" -ForegroundColor Red
        exit 1
    }
}

# Проверка git
$gitPath = Get-Command git -ErrorAction SilentlyContinue

if (-not $gitPath) {
    Write-Host "Git не найден. Установите Git: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

# Проверка .env файла
if (-not (Test-Path ".env")) {
    Write-Host "Файл .env не найден. Создаю из .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host ".env создан. Пожалуйста, отредактируйте его и запустите скрипт снова." -ForegroundColor Yellow
        Write-Host "Важно: установите NEXTAUTH_SECRET с помощью команды: openssl rand -base64 32" -ForegroundColor Cyan
        exit 0
    } else {
        Write-Host ".env.example не найден!" -ForegroundColor Red
        exit 1
    }
}

# Проверка node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "Установка зависимостей..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Ошибка установки зависимостей" -ForegroundColor Red
        exit 1
    }
}

# Проверка git репозитория
if (-not (Test-Path ".git")) {
    Write-Host "Инициализация Git репозитория..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit for Vercel deploy"
}

# Авторизация в Vercel
Write-Host ""
Write-Host "Проверка авторизации в Vercel..." -ForegroundColor Cyan
vercel whoami

if ($LASTEXITCODE -ne 0) {
    Write-Host "Требуется авторизация..." -ForegroundColor Yellow
    vercel login
}

# Запрос URL для NEXTAUTH_URL
Write-Host ""
$projectName = Read-Host "Введите название проекта (например, smart-goals-app)"
$nextauthUrl = "https://$projectName.vercel.app"

# Обновление .env
Write-Host ""
Write-Host "Обновление .env файла..." -ForegroundColor Cyan
$envContent = Get-Content ".env" -Raw

# Удаляем старый NEXTAUTH_URL если есть
$envContent = $envContent -replace "NEXTAUTH_URL=.*\n", ""

# Добавляем новый NEXTAUTH_URL
$envContent += "`nNEXTAUTH_URL=$nextauthUrl"

Set-Content ".env" $envContent

Write-Host "NEXTAUTH_URL установлен: $nextauthUrl" -ForegroundColor Green
Write-Host ""

# Деплой
Write-Host "Запуск деплоя..." -ForegroundColor Green
Write-Host ""

vercel --prod --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "Деплой успешно запущен!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ваше приложение будет доступно по адресу:" -ForegroundColor Cyan
    Write-Host "$nextauthUrl" -ForegroundColor White
    Write-Host ""
    Write-Host "Важно: После деплоя добавьте Environment Variables в Vercel Dashboard:" -ForegroundColor Yellow
    Write-Host "1. Перейдите в Project Settings → Environment Variables" -ForegroundColor White
    Write-Host "2. Добавьте:" -ForegroundColor White
    Write-Host "   DATABASE_URL = file:/tmp/dev.db" -ForegroundColor White
    Write-Host "   NEXTAUTH_SECRET = $(Get-Content .env | Select-String 'NEXTAUTH_SECRET=' | ForEach-Object { $_.ToString().Split('=')[1] })" -ForegroundColor White
    Write-Host "   NEXTAUTH_URL = $nextauthUrl" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Пересоберите проект: vercel --prod" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host "Ошибка деплоя!" -ForegroundColor Red
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Проверьте логи выше или попробуйте вручную:" -ForegroundColor Yellow
    Write-Host "vercel --prod" -ForegroundColor White
}