"use client"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ value, size = "md", showLabel = true, className }: ProgressBarProps) {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }

  const getColor = (val: number) => {
    if (val >= 80) return "bg-emerald-500"
    if (val >= 50) return "bg-blue-500"
    if (val >= 25) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <Progress 
          value={value} 
          className={cn(sizeClasses[size])}
        />
        <div 
          className={cn(
            "absolute top-0 left-0 h-full rounded-full transition-all duration-500",
            getColor(value)
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Прогресс</span>
          <span className="font-medium">{value}%</span>
        </div>
      )}
    </div>
  )
}