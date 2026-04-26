"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Target, LayoutDashboard, Plus, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
  { name: "Цели", href: "/goals", icon: Target },
  { name: "Новая цель", href: "/goals/new", icon: Plus },
  { name: "Статистика", href: "/dashboard", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Target className="h-6 w-6 text-primary mr-2" />
        <span className="text-lg font-bold">SMART Goals</span>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground">
          <Settings className="h-4 w-4" />
          Настройки
        </div>
      </div>
    </div>
  )
}