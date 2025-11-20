"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type TimeRange = "week" | "month" | "year"

interface TimeFilterProps {
  value: TimeRange
  onChange: (value: TimeRange) => void
}

export function TimeFilter({ value, onChange }: TimeFilterProps) {
  const options: { label: string; value: TimeRange }[] = [
    { label: "周", value: "week" },
    { label: "月", value: "month" },
    { label: "年", value: "year" },
  ]

  return (
    <div className="flex p-1 bg-gray-100 rounded-full">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            value === opt.value
              ? "bg-white text-teal-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

