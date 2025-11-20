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
    <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50 rounded-t-2xl">
      {keys.map((key) => {
        if (key === "") return <div key="empty" />
        
        if (key === "DEL") {
          return (
            <Button
              key={key}
              variant="ghost"
              className="h-14 text-xl font-medium bg-white shadow-sm active:scale-95 transition-transform rounded-2xl"
              onClick={onDelete}
            >
              <Delete className="w-6 h-6 text-gray-600" />
            </Button>
          )
        }

        if (key === "OK") {
          return (
            <Button
              key={key}
              className={cn(
                "h-14 text-xl font-bold text-white shadow-md active:scale-95 transition-transform rounded-2xl row-span-1",
                submitColorClass || "bg-teal-600 hover:bg-teal-700"
              )}
              onClick={onSubmit}
            >
              完成
            </Button>
          )
        }

        const isOperator = ["+", "-"].includes(key)

        return (
          <Button
            key={key}
            variant={isOperator ? "secondary" : "ghost"}
            className={cn(
              "h-14 text-2xl font-medium shadow-sm active:scale-95 transition-transform rounded-2xl",
              isOperator ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : "bg-white text-gray-800 hover:bg-gray-50"
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

