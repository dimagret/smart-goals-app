"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Goal {
  id: string
  title: string
  category: string
  status: string
  progress: number
  timeBound: string
  subtasks: { completed: boolean }[]
}

interface ChartsProps {
  goals: Goal[]
}

const COLORS = {
  work: "#3b82f6",
  health: "#22c55e",
  learning: "#a855f7",
  finance: "#f59e0b",
  personal: "#ec4899",
  general: "#6b7280",
}

const STATUS_COLORS = {
  active: "#3b82f6",
  completed: "#22c55e",
  cancelled: "#ef4444",
}

export function GoalCharts({ goals }: ChartsProps) {
  const [activeTab, setActiveTab] = useState("progress")

  // Prepare data for category chart
  const categoryData = Object.entries(
    goals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name: getCategoryLabel(name),
    value,
    color: COLORS[name as keyof typeof COLORS] || COLORS.general,
  }))

  // Prepare data for status chart
  const statusData = [
    {
      name: "Активные",
      value: goals.filter(g => g.status === "active").length,
      color: STATUS_COLORS.active,
    },
    {
      name: "Завершенные",
      value: goals.filter(g => g.status === "completed").length,
      color: STATUS_COLORS.completed,
    },
    {
      name: "Отмененные",
      value: goals.filter(g => g.status === "cancelled").length,
      color: STATUS_COLORS.cancelled,
    },
  ].filter(d => d.value > 0)

  // Prepare data for progress chart (top 5 goals)
  const progressData = goals
    .filter(g => g.status === "active")
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5)
    .map(goal => ({
      name: goal.title.length > 20 ? goal.title.substring(0, 20) + "..." : goal.title,
      progress: goal.progress,
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Аналитика</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Прогресс</TabsTrigger>
            <TabsTrigger value="categories">Категории</TabsTrigger>
            <TabsTrigger value="status">Статусы</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="h-[300px]">
            {progressData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, "Прогресс"]}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Bar dataKey="progress" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Нет данных для отображения
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Нет данных для отображения
              </div>
            )}
          </TabsContent>

          <TabsContent value="status" className="h-[300px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Нет данных для отображения
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    work: "Работа",
    health: "Здоровье",
    learning: "Обучение",
    finance: "Финансы",
    personal: "Личное",
    general: "Общее",
  }
  return labels[category] || category
}