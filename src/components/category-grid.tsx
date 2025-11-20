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
    <ScrollArea className="w-full px-4">
      <div className="grid grid-cols-4 gap-y-4 gap-x-2 py-2">
        {filteredCategories.map((category) => {
          const isSelected = selectedId === category.id
          const Icon = category.icon
          
          return (
            <div key={category.id} className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => onSelect(category.id)}>
              <div 
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
                  isSelected ? "bg-teal-600 text-white shadow-lg scale-110" : category.color,
                  !isSelected && "group-hover:scale-105"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors",
                isSelected ? "text-teal-600" : "text-gray-500"
              )}>
                {category.name}
              </span>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

