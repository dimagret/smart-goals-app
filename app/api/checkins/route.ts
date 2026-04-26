import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { goalId, note, progress } = body

    // Verify goal belongs to user
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    })

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

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
    console.error("Error creating check-in:", error)
    return NextResponse.json({ error: "Failed to create check-in" }, { status: 500 })
  }
}