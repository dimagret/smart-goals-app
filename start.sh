#!/bin/bash

echo "=========================================="
echo "SMART Goals App - Quick Start"
echo "=========================================="
echo ""

cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
    echo "[1/4] Installing dependencies..."
    npm install
else
    echo "[1/4] Dependencies already installed"
fi

echo ""
echo "[2/4] Generating Prisma Client..."
npx prisma generate

echo ""
echo "[3/4] Running migrations..."
npx prisma migrate dev --name init

echo ""
read -p "Do you want to seed demo data? (y/n): " SEED
if [ "$SEED" = "y" ] || [ "$SEED" = "Y" ]; then
    echo "[4/4] Seeding demo data..."
    npm run db:seed
else
    echo "[4/4] Skipping seed"
fi

echo ""
echo "=========================================="
echo "Starting development server..."
echo "=========================================="
echo ""

npm run dev