"use client"

import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Bell, Calendar } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const today = new Date()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>{format(today, "d MMMM yyyy, EEEE", { locale: ru })}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        <button className="relative rounded-full p-2 hover:bg-accent">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </button>
      </div>
    </header>
  )
}