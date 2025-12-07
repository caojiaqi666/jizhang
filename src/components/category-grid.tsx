"use client"

import * as React from "react"
import { Utensils, Bus, ShoppingBag, Clapperboard, Heart, Home, Book, Dumbbell, Gift, Briefcase, Plane, HelpCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export type CategoryType = "expense" | "income"

export const CATEGORIES = [
  { id: "food", name: "餐饮", icon: Utensils, color: "bg-orange-100 text-orange-600", type: "expense" },
  { id: "transport", name: "交通", icon: Bus, color: "bg-blue-100 text-blue-600", type: "expense" },
  { id: "shopping", name: "购物", icon: ShoppingBag, color: "bg-pink-100 text-pink-600", type: "expense" },
  { id: "entertainment", name: "娱乐", icon: Clapperboard, color: "bg-purple-100 text-purple-600", type: "expense" },
  { id: "health", name: "医疗", icon: Heart, color: "bg-red-100 text-red-600", type: "expense" },
  { id: "housing", name: "居住", icon: Home, color: "bg-indigo-100 text-indigo-600", type: "expense" },
  { id: "education", name: "学习", icon: Book, color: "bg-yellow-100 text-yellow-600", type: "expense" },
  { id: "fitness", name: "运动", icon: Dumbbell, color: "bg-green-100 text-green-600", type: "expense" },
  { id: "salary", name: "工资", icon: Briefcase, color: "bg-teal-100 text-teal-600", type: "income" },
  { id: "bonus", name: "奖金", icon: Gift, color: "bg-amber-100 text-amber-600", type: "income" },
  { id: "travel", name: "旅行", icon: Plane, color: "bg-sky-100 text-sky-600", type: "expense" },
  { id: "other", name: "其他", icon: HelpCircle, color: "bg-gray-100 text-gray-600", type: "expense" },
]

interface CategoryGridProps {
  selectedId: string | null
  onSelect: (id: string) => void
  type: CategoryType
}

export function CategoryGrid({ selectedId, onSelect, type }: CategoryGridProps) {
  const filteredCategories = CATEGORIES.filter(c => c.type === type)

  return (
    <div className="w-full px-6 py-3">
      <label className="text-xs text-gray-500 font-semibold mb-3 block ml-1">选择分类</label>
      <div className="bg-white rounded-3xl shadow-md p-4 border border-gray-100">
        <div className="grid grid-cols-4 gap-y-5 gap-x-3">
          {filteredCategories.map((category) => {
            const isSelected = selectedId === category.id
            const Icon = category.icon
            
            return (
              <div 
                key={category.id} 
                className="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform" 
                onClick={() => onSelect(category.id)}
              >
                <div 
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm",
                    isSelected 
                      ? (type === 'expense' 
                          ? "bg-expense text-white shadow-lg shadow-expense/30 scale-105" 
                          : "bg-income text-white shadow-lg shadow-income/30 scale-105") 
                      : category.color + " group-hover:shadow-md group-hover:scale-105"
                  )}
                >
                  <Icon className={cn(
                    "stroke-[2.5px] transition-all",
                    isSelected ? "w-7 h-7" : "w-6 h-6"
                  )} />
                </div>
                <span className={cn(
                  "text-[11px] font-semibold transition-colors leading-tight text-center",
                  isSelected 
                    ? (type === 'expense' ? "text-expense" : "text-income") 
                    : "text-gray-500"
                )}>
                  {category.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

