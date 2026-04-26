"use client"

import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Bell, Calendar, LogOut, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export function Header() {
  const { data: session } = useSession()
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
        
        {session?.user && (
          <>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden md:block">
                {session.user.name || session.user.email}
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </header>
  )
}