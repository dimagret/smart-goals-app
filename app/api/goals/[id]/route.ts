import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: params.id },
      include: {
        subtasks: true,
        checkIns: {
          orderBy: { date: "desc" },
        },
      },
    })

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    return NextResponse.json(goal)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch goal" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, specific, measurable, achievable, relevant, timeBound, category, status, progress, subtaskId, completed } = body

    // If updating subtask
    if (subtaskId) {
      await prisma.subtask.update({
        where: { id: subtaskId },
        data: { completed },
      })

      // Recalculate progress based on completed subtasks
      const subtasks = await prisma.subtask.findMany({
        where: { goalId: params.id },
      })

      const completedCount = subtasks.filter(s => s.completed).length
      const newProgress = subtasks.length > 0 
        ? Math.round((completedCount / subtasks.length) * 100)
        : 0

      await prisma.goal.update({
        where: { id: params.id },
        data: { progress: newProgress },
      })

      const updatedGoal = await prisma.goal.findUnique({
        where: { id: params.id },
        include: { subtasks: true },
      })

      return NextResponse.json(updatedGoal)
    }

    // Regular goal update
    const goal = await prisma.goal.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(specific && { specific }),
        ...(measurable && { measurable }),
        ...(achievable && { achievable }),
        ...(relevant && { relevant }),
        ...(timeBound && { timeBound: new Date(timeBound) }),
        ...(category && { category }),
        ...(status && { status }),
        ...(progress !== undefined && { progress }),
        ...(status === "completed" && { completedAt: new Date() }),
      },
      include: {
        subtasks: true,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.goal.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 })
  }
}