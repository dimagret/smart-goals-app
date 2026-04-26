"use client"

import { Target, CheckCircle2, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressBar } from "./ProgressBar"

interface DashboardStatsProps {
  goals: {
    id: string
    status: string
    progress: number
    timeBound: Date
  }[]
}

export function DashboardStats({ goals }: DashboardStatsProps) {
  const totalGoals = goals.length
  const activeGoals = goals.filter(g => g.status === "active").length
  const completedGoals = goals.filter(g => g.status === "completed").length
  const avgProgress = totalGoals > 0
    ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / totalGoals)
    : 0

  const overdueGoals = goals.filter(g => {
    if (g.status !== "active") return false
    return new Date(g.timeBound) < new Date()
  }).length

  const stats = [
    {
      title: "Всего целей",
      value: totalGoals,
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Активных",
      value: activeGoals,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "Завершено",
      value: completedGoals,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Просрочено",
      value: overdueGoals,
      icon: TrendingUp,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Общий прогресс</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar value={avgProgress} size="lg" />
          <p className="text-sm text-muted-foreground mt-2">
            Средний прогресс по всем целям: {avgProgress}%
          </p>
        </CardContent>
      </Card>
    </div>
  )
}