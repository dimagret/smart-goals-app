import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
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
    console.error("Error fetching goals:", error)
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
        userId: session.user.id,
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
    console.error("Error creating goal:", error)
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
  }
}