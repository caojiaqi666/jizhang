"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { PiggyBank } from "lucide-react"
import confetti from "canvas-confetti"
import { useTheme, THEME_VARIANTS } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface SavingsCardProps {
    goal: number
    balance: number
    visible: boolean
}

export function SavingsCard({ goal, balance, visible }: SavingsCardProps) {
    const { primaryColor } = useTheme()
    const theme = THEME_VARIANTS[primaryColor]
    const [progress, setProgress] = useState(0)
    const [confettiFired, setConfettiFired] = useState(false)

    useEffect(() => {
        if (goal <= 0) {
            setProgress(0)
            return
        }
        // Calculate progress. If balance < 0, progress is 0. 
        // If balance > goal, cap at 100 (or >100 if we want to show over-achievement)
        const p = Math.max(0, (balance / goal) * 100)
        
        // Animate progress
        const timer = setTimeout(() => setProgress(p), 500)
        
        // Fire confetti if reached 100% and hasn't fired this period
        if (p >= 100 && visible) {
            const now = new Date()
            const key = `savings-celebrated-${now.getFullYear()}-${now.getMonth() + 1}`
            const hasCelebrated = localStorage.getItem(key)

            if (!hasCelebrated) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                })
                localStorage.setItem(key, 'true')
                setConfettiFired(true)
            }
        }

        return () => clearTimeout(timer)
    }, [goal, balance, visible])

    if (!visible) return null

    let message = "开始存钱吧！"
    if (progress >= 100) message = "太棒了！目标达成 🎉"
    else if (progress >= 70) message = "加油！离目标很近了 💪"
    else if (progress >= 30) message = "不错的开始，继续保持 🚀"
    else if (progress > 0) message = "积少成多，每一笔都算数 ✨"

    return (
        <Card className={cn("border-0 shadow-sm overflow-hidden relative", theme.lightBg)}>
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <div className={cn("flex items-center gap-2 font-medium", theme.text)}>
                        <PiggyBank className="w-4 h-4" />
                        <span className="text-xs">本月存钱挑战</span>
                    </div>
                    <div className={cn("text-xs font-mono font-bold", theme.text)}>
                        {progress.toFixed(0)}%
                    </div>
                </div>
                
                <Progress value={progress} className="h-2 bg-white/50" indicatorClassName={theme.bg} />
                
                <div className="flex justify-between items-center mt-2">
                    <span className={cn("text-[10px] font-medium opacity-80", theme.text)}>{message}</span>
                    <span className={cn("text-[10px] font-mono opacity-60", theme.text)}>
                        ¥{balance.toFixed(0)} / {goal.toFixed(0)}
                    </span>
                </div>

                {/* Decorative Background */}
                <div className={cn("absolute -right-4 -bottom-8 w-24 h-24 rounded-full blur-xl opacity-20", theme.bg)}></div>
            </CardContent>
        </Card>
    )
}
