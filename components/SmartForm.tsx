"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Target, Ruler, Zap, Link2, Calendar, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const categories = [
  { value: "work", label: "Работа", color: "bg-blue-100 text-blue-800" },
  { value: "health", label: "Здоровье", color: "bg-green-100 text-green-800" },
  { value: "learning", label: "Обучение", color: "bg-purple-100 text-purple-800" },
  { value: "finance", label: "Финансы", color: "bg-amber-100 text-amber-800" },
  { value: "personal", label: "Личное", color: "bg-pink-100 text-pink-800" },
]

interface Subtask {
  id: string
  title: string
}

export function SmartForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [subtasks, setSubtasks] = useState<Subtask[]>([{ id: "1", title: "" }])
  
  const [formData, setFormData] = useState({
    title: "",
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timeBound: "",
    category: "work",
  })

  const addSubtask = () => {
    setSubtasks([...subtasks, { id: Date.now().toString(), title: "" }])
  }

  const removeSubtask = (id: string) => {
    if (subtasks.length > 1) {
      setSubtasks(subtasks.filter(s => s.id !== id))
    }
  }

  const updateSubtask = (id: string, title: string) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, title } : s))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subtasks: subtasks.filter(s => s.title.trim()).map(s => s.title),
        }),
      })

      if (response.ok) {
        router.push("/goals")
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const smartFields = [
    {
      key: "specific",
      label: "Specific — Конкретика",
      description: "Что именно вы хотите достичь? Опишите конкретный результат.",
      icon: Target,
      placeholder: "Например: Создать веб-приложение для SMART-планирования целей с трекингом прогресса",
    },
    {
      key: "measurable",
      label: "Measurable — Измеримость",
      description: "Как вы измерите прогресс? Какие метрики будете использовать?",
      icon: Ruler,
      placeholder: "Например: Приложение должно позволять создавать цели, отслеживать прогресс в %, добавлять подзадачи",
    },
    {
      key: "achievable",
      label: "Achievable — Достижимость",
      description: "Есть ли у вас ресурсы и навыки? Что нужно для достижения?",
      icon: Zap,
      placeholder: "Например: У меня есть 4-6 часов в день, опыт в React/Next.js, доступ к AI-инструментам",
    },
    {
      key: "relevant",
      label: "Relevant — Актуальность",
      description: "Почему эта цель важна именно сейчас? Как она связана с вашими долгосрочными планами?",
      icon: Link2,
      placeholder: "Например: Это поможет мне систематизировать работу над проектами и повысить продуктивность",
    },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Название цели</label>
            <Input
              placeholder="Краткое название вашей цели"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Категория</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    formData.category === cat.value
                      ? cat.color + " ring-2 ring-offset-2 ring-primary"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Дедлайн (Time-bound)
            </label>
            <Input
              type="date"
              value={formData.timeBound}
              onChange={(e) => setFormData({ ...formData, timeBound: e.target.value })}
              required
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {smartFields.map((field, index) => {
        const Icon = field.icon
        return (
          <Card key={field.key} className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1 bg-primary opacity-20" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{field.label}</CardTitle>
                  <p className="text-sm text-muted-foreground">{field.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={field.placeholder}
                value={formData[field.key as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                required
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        )
      })}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Подзадачи</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addSubtask}>
              <Plus className="h-4 w-4 mr-1" />
              Добавить
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {subtasks.map((subtask, index) => (
            <div key={subtask.id} className="flex items-center gap-2">
              <Badge variant="outline" className="shrink-0">{index + 1}</Badge>
              <Input
                placeholder={`Подзадача ${index + 1}`}
                value={subtask.title}
                onChange={(e) => updateSubtask(subtask.id, e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSubtask(subtask.id)}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/goals")}
        >
          Отмена
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Создание..." : "Создать SMART цель"}
        </Button>
      </div>
    </form>
  )
}