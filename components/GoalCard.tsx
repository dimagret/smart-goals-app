"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Target, Calendar, TrendingUp, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "./ProgressBar"
import { cn } from "@/lib/utils"

interface Subtask {
  id: string
  completed: boolean
}

interface Goal {
  id: string
  title: string
  category: string
  status: string
  progress: number
  timeBound: Date | string
  subtasks: Subtask[]
}

interface GoalCardProps {
  goal: Goal
}

const statusConfig = {
  active: { label: "Активна", variant: "default" as const, icon: Target },
  completed: { label: "Завершена", variant: "secondary" as const, icon: CheckCircle2 },
  cancelled: { label: "Отменена", variant: "destructive" as const, icon: Clock },
}

const categoryColors: Record<string, string> = {
  work: "bg-blue-100 text-blue-800",
  health: "bg-green-100 text-green-800",
  learning: "bg-purple-100 text-purple-800",
  finance: "bg-amber-100 text-amber-800",
  personal: "bg-pink-100 text-pink-800",
  general: "bg-gray-100 text-gray-800",
}

export function GoalCard({ goal }: GoalCardProps) {
  const status = statusConfig[goal.status as keyof typeof statusConfig] || statusConfig.active
  const StatusIcon = status.icon
  const completedSubtasks = goal.subtasks.filter(s => s.completed).length
  const totalSubtasks = goal.subtasks.length

  const [daysLeft, setDaysLeft] = useState(0)
  const [isOverdue, setIsOverdue] = useState(false)

  useEffect(() => {
    const left = Math.ceil((new Date(goal.timeBound).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    setDaysLeft(left)
    setIsOverdue(left < 0)
  }, [goal.timeBound])

  return (
    <Link href={`/goals/${goal.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Badge 
                variant="outline" 
                className={cn("text-xs", categoryColors[goal.category] || categoryColors.general)}
              >
                {goal.category}
              </Badge>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {goal.title}
              </CardTitle>
            </div>
            <Badge variant={status.variant} className="gap-1">
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <ProgressBar value={goal.progress} size="sm" />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(goal.timeBound), "d MMM", { locale: ru })}
              </span>
              
              {totalSubtasks > 0 && (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {completedSubtasks}/{totalSubtasks}
                </span>
              )}
            </div>
            
            <span className={cn(
              "flex items-center gap-1",
              isOverdue && "text-destructive font-medium"
            )}>
              <TrendingUp className="h-3.5 w-3.5" />
              {isOverdue ? `Просрочено на ${Math.abs(daysLeft)} дн.` : `${daysLeft} дн. осталось`}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}