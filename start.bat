@echo off
echo ==========================================
echo SMART Goals App - Quick Start
echo ==========================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo [1/4] Installing dependencies...
    call npm install
) else (
    echo [1/4] Dependencies already installed
)

echo.
echo [2/4] Generating Prisma Client...
call npx prisma generate

echo.
echo [3/4] Running migrations...
call npx prisma migrate dev --name init

echo.
set /p SEED="Do you want to seed demo data? (y/n): "
if /i "%SEED%"=="y" (
    echo [4/4] Seeding demo data...
    call npm run db:seed
) else (
    echo [4/4] Skipping seed
)

echo.
echo ==========================================
echo Starting development server...
echo ==========================================
echo.

call npm run dev

pause