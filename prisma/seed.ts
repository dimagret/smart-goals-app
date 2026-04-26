import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: 'Демо Пользователь',
      email: 'demo@example.com',
      password: hashedPassword,
    },
  })

  console.log(`Created/Updated user: ${user.email}`)

  // Delete existing goals for this user
  await prisma.goal.deleteMany({
    where: { userId: user.id },
  })

  // Create demo goals
  const goals = [
    {
      title: 'Создать SMART Goals приложение',
      specific: 'Разработать веб-приложение для SMART-планирования целей с трекингом прогресса, подзадачами и системой чек-инов',
      measurable: 'Приложение должно позволять: создавать цели по 5 критериям SMART, отслеживать прогресс в процентах, добавлять подзадачи, делать ежедневные чек-ины, просматривать статистику',
      achievable: 'У меня есть 4-6 часов в день, опыт в React/Next.js, доступ к AI-инструментам. Стек: Next.js + TypeScript + Prisma + SQLite',
      relevant: 'Это поможет систематизировать работу над проектами, повысить продуктивность и создать портфолио для продакт-менеджмента',
      timeBound: new Date('2025-05-26'),
      category: 'work',
      status: 'active',
      progress: 65,
      subtasks: [
        'Спроектировать базу данных',
        'Создать UI компоненты',
        'Реализовать API endpoints',
        'Добавить трекинг прогресса',
        'Настроить деплой на Vercel',
      ],
    },
    {
      title: 'Написать 10 постов в Telegram',
      specific: 'Вести блог о процессе разработки SMART-приложения, публиковать минимум 10 постов за 30 дней',
      measurable: '10 постов, каждый минимум 500 символов, 50+ просмотров на каждый',
      achievable: 'Материал пишется сам собой во время разработки, нужно только оформлять заметки',
      relevant: 'Развитие личного бренда, документирование процесса, создание контента для портфолио',
      timeBound: new Date('2025-05-26'),
      category: 'personal',
      status: 'active',
      progress: 30,
      subtasks: [
        'Создать канал в Telegram',
        'Написать первый пост о концепции',
        'Пост о техническом стеке',
        'Пост о проектировании БД',
        'Пост о UI/UX решениях',
      ],
    },
    {
      title: 'Изучить Next.js 14 App Router',
      specific: 'Полностью освоить App Router, Server Components, API Routes и работу с базой данных через Prisma',
      measurable: 'Создать полноценное приложение с SSR, API endpoints, оптимизацией',
      achievable: 'Есть база в React, официальная документация, примеры проектов',
      relevant: 'Next.js — стандарт для React-приложений, необходим для работы и фриланса',
      timeBound: new Date('2025-06-15'),
      category: 'learning',
      status: 'active',
      progress: 45,
      subtasks: [
        'Изучить Server Components',
        'Понять API Routes',
        'Освоить Prisma ORM',
        'Разобраться с кэшированием',
      ],
    },
  ]

  for (const goalData of goals) {
    const { subtasks, ...goal } = goalData
    
    const createdGoal = await prisma.goal.create({
      data: {
        ...goal,
        userId: user.id,
        subtasks: {
          create: subtasks.map((title, index) => ({
            title,
            completed: index < 2, // First 2 subtasks completed
          })),
        },
      },
    })

    // Add some check-ins
    const today = new Date()
    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      await prisma.checkIn.create({
        data: {
          goalId: createdGoal.id,
          date,
          progress: Math.min((i + 1) * 15, goal.progress),
          note: `День ${i + 1}: Работа над ${subtasks[i % subtasks.length]}`,
        },
      })
    }

    console.log(`Created goal: ${createdGoal.title}`)
  }

  console.log('Seeding finished.')
  console.log('Demo credentials:')
  console.log('  Email: demo@example.com')
  console.log('  Password: password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })