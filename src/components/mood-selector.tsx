"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export const MOODS = [
  { id: "happy", label: "开心", emoji: "😊", message: "花得值最重要！" },
  { id: "neutral", label: "平淡", emoji: "😐", message: "记录生活点滴。" },
  { id: "sad", label: "难过", emoji: "😔", message: "抱抱你，会好起来的。" },
  { id: "angry", label: "生气", emoji: "😡", message: "消消气，别气坏身子。" },
  { id: "anxious", label: "焦虑", emoji: "😰", message: "深呼吸，一切都在掌控中。" },
  { id: "grateful", label: "感恩", emoji: "🥰", message: "常怀感恩之心。" },
  { id: "regret", label: "后悔", emoji: "😭", message: "吃一堑长一智。" },
]

interface MoodSelectorProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

export function MoodSelector({ selectedId, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 py-2 no-scrollbar">
      {MOODS.map((mood) => {
        const isSelected = selectedId === mood.id
        
        return (
          <button
            key={mood.id}
            onClick={() => onSelect(mood.id)}
            className={cn(
              "flex flex-col items-center gap-1 min-w-[3rem] transition-all duration-200",
              isSelected ? "scale-110" : "opacity-60 hover:opacity-100 scale-100"
            )}
          >
            <span className="text-3xl filter drop-shadow-sm">{mood.emoji}</span>
            <span className={cn(
              "text-[10px] font-medium",
              isSelected ? "text-teal-600" : "text-gray-400"
            )}>
              {mood.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

