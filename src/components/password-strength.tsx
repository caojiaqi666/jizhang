"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const criteria = [
    { label: "至少 8 位字符", met: password.length >= 8 },
    { label: "包含字母", met: /[a-zA-Z]/.test(password) },
    { label: "包含数字", met: /[0-9]/.test(password) },
  ]

  const strength = criteria.filter(c => c.met).length

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1 h-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-full flex-1 rounded-full transition-colors duration-300",
              strength >= i 
                ? (strength === 3 ? "bg-green-500" : strength === 2 ? "bg-yellow-500" : "bg-red-500")
                : "bg-gray-200"
            )}
          />
        ))}
      </div>
      <ul className="space-y-1">
        {criteria.map((item, index) => (
          <li key={index} className="flex items-center gap-2 text-xs">
            {item.met ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <div className="w-3 h-3 rounded-full border border-gray-300" />
            )}
            <span className={cn(item.met ? "text-green-600" : "text-gray-400")}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

