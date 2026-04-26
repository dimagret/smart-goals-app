import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const goals = await prisma.goal.findMany({
      include: {
        subtasks: true,
        checkIns: {
          orderBy: { date: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(goals)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, specific, measurable, achievable, relevant, timeBound, category, subtasks } = body

    const goal = await prisma.goal.create({
      data: {
        title,
        specific,
        measurable,
        achievable,
        relevant,
        timeBound: new Date(timeBound),
        category: category || "general",
        userId: "demo-user",
        subtasks: {
          create: subtasks?.map((title: string) => ({ title })) || [],
        },
      },
      include: {
        subtasks: true,
      },
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
  }
}