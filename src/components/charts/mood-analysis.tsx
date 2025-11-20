"use client"

import * as React from "react"
import { MOODS } from "@/components/mood-selector"
import { cn } from "@/lib/utils"

interface MoodAnalysisProps {
    data: { id: string; amount: number }[]
}

export function MoodAnalysis({ data }: MoodAnalysisProps) {
  if (!data || data.length === 0) return <div className="py-8 text-center text-gray-400 text-xs">暂无情绪账单，快去记录一笔吧～</div>;

  // Find top spending mood
  const topMood = data[0] // Already sorted
  const topMoodInfo = MOODS.find(m => m.id === topMood.id)
  const totalAmount = data.reduce((acc, cur) => acc + cur.amount, 0)

  return (
    <div className="space-y-4">
      {/* Insight Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="text-4xl bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
            {topMoodInfo?.emoji || '😐'}
          </div>
          <div>
             <h3 className="text-indigo-900 font-medium text-sm mb-1">情绪洞察</h3>
             <p className="text-indigo-700 text-xs leading-relaxed">
               你在 <span className="font-bold mx-0.5">{topMoodInfo?.label || '未知'}</span> 时花钱最多，
               共消费 <span className="font-mono font-bold">¥{topMood.amount.toFixed(0)}</span>。
               {topMood.id === 'regret' ? '下次冲动前，先深呼吸三次哦。' : '保持好心情，钱花得才值！'}
             </p>
          </div>
        </div>
      </div>

      {/* Mood List */}
      <div className="space-y-3">
        {data.map((item) => {
          const moodInfo = MOODS.find(m => m.id === item.id)
          if (!moodInfo) return null
          
          const percent = (item.amount / totalAmount) * 100

          return (
            <div key={item.id} className="flex items-center gap-3">
               <div className="w-8 text-xl text-center">{moodInfo.emoji}</div>
               <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700">{moodInfo.label}</span>
                    <span className="font-mono text-gray-900">¥{item.amount}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className={cn("h-full rounded-full", 
                            item.id === 'happy' ? "bg-orange-300" :
                            item.id === 'regret' ? "bg-red-300" :
                            item.id === 'anxious' ? "bg-purple-300" :
                            "bg-teal-300"
                        )} 
                        style={{ width: `${percent}%` }} 
                    />
                  </div>
               </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
