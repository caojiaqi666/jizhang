"use client"

import * as React from "react"
import { Delete, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface KeypadProps {
  onKeyPress: (key: string) => void
  onDelete: () => void
  onSubmit: () => void
  submitColorClass?: string
}

export function Keypad({ onKeyPress, onDelete, onSubmit, submitColorClass }: KeypadProps) {
  const keys = [
    "1", "2", "3", "+",
    "4", "5", "6", "-",
    "7", "8", "9", "",
    ".", "0", "DEL", "OK"
  ]

  return (
    <div className="grid grid-cols-4 gap-3 p-4 pb-8 bg-white rounded-t-[32px] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {keys.map((key) => {
        if (key === "") return <div key="empty" />
        
        if (key === "DEL") {
          return (
            <Button
              key={key}
              variant="ghost"
              className="h-16 w-16 rounded-full text-xl font-medium bg-gray-50 shadow-sm active:scale-90 transition-all hover:bg-gray-100 text-gray-500"
              onClick={onDelete}
            >
              <Delete className="w-6 h-6" />
            </Button>
          )
        }

        if (key === "OK") {
          return (
            <Button
              key={key}
              className={cn(
                "h-16 rounded-[32px] text-xl font-bold text-white shadow-lg active:scale-95 transition-all row-span-1 col-span-1",
                submitColorClass || "bg-primary hover:bg-primary/90"
              )}
              onClick={onSubmit}
            >
              OK
            </Button>
          )
        }

        const isOperator = ["+", "-"].includes(key)

        return (
          <Button
            key={key}
            variant="ghost"
            className={cn(
              "h-16 w-16 rounded-full text-2xl font-bold shadow-[0_2px_8px_rgba(0,0,0,0.05)] active:scale-90 transition-all font-nunito",
              isOperator ? "bg-accent/20 text-accent hover:bg-accent/30" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-100"
            )}
            onClick={() => onKeyPress(key)}
          >
            {key}
          </Button>
        )
      })}
    </div>
  )
}

