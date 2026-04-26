import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { DashboardStats } from "@/components/DashboardStats"
import { GoalCard } from "@/components/GoalCard"
import { GoalCharts } from "@/components/GoalCharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getAuthSession()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id },
    include: {
      subtasks: true,
      checkIns: {
        orderBy: { date: "desc" },
        take: 5,
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const activeGoals = goals.filter(g => g.status === "active").slice(0, 3)
  const recentGoals = goals.slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Дашборд</h1>
          <p className="text-muted-foreground">
            Обзор ваших SMART-целей и прогресса
          </p>
        </div>
        <Button asChild>
          <Link href="/goals/new">
            <Target className="mr-2 h-4 w-4" />
            Новая цель
          </Link>
        </Button>
      </div>

      <DashboardStats goals={goals} />

      <GoalCharts goals={goals} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Активные цели</CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/goals" className="gap-1">
                Все цели
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeGoals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="mx-auto h-12 w-12 mb-3 opacity-20" />
                <p>Нет активных целей</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/goals/new">Создать первую цель</Link>
                </Button>
              </div>
            ) : (
              activeGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Последние чек-ины</CardTitle>
          </CardHeader>
          <CardContent>
            {recentGoals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>История чек-инов появится здесь</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{goal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Прогресс: {goal.progress}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}