import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { GoalCard } from "@/components/GoalCard"
import { Button } from "@/components/ui/button"
import { Target, Plus } from "lucide-react"
import Link from "next/link"

export default async function GoalsPage() {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id },
    include: {
      subtasks: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const activeGoals = goals.filter(g => g.status === "active")
  const completedGoals = goals.filter(g => g.status === "completed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Мои цели</h1>
          <p className="text-muted-foreground">
            Управление SMART-целями
          </p>
        </div>
        <Button asChild>
          <Link href="/goals/new">
            <Plus className="mr-2 h-4 w-4" />
            Новая цель
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Активные ({activeGoals.length})</h2>
          {activeGoals.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-card">
              <Target className="mx-auto h-12 w-12 mb-3 opacity-20" />
              <p className="text-muted-foreground">Нет активных целей</p>
              <Button variant="link" asChild className="mt-2">
                <Link href="/goals/new">Создать первую цель</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </div>

        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Завершенные ({completedGoals.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}