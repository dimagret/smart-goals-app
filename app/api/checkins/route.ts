import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { goalId, note, progress } = body

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Upsert check-in for today
    const checkIn = await prisma.checkIn.upsert({
      where: {
        goalId_date: {
          goalId,
          date: today,
        },
      },
      update: {
        note,
        progress,
      },
      create: {
        goalId,
        date: today,
        note,
        progress,
      },
    })

    // Update goal progress
    await prisma.goal.update({
      where: { id: goalId },
      data: { progress },
    })

    return NextResponse.json(checkIn, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create check-in" }, { status: 500 })
  }
}