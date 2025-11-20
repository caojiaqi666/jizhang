"use client"

import { useEffect, useState } from "react"
import { isMonday, isLastDayOfMonth, format, addDays, isAfter, isSameDay } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PiggyBank } from "lucide-react"
import confetti from "canvas-confetti"

interface SavingsReminderProps {
    enabled: boolean
    goal: number
    balance: number
}

export function SavingsReminder({ enabled, goal, balance }: SavingsReminderProps) {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!enabled || goal <= 0) return

        const lastCheckStr = localStorage.getItem("last-savings-check")
        const today = new Date()
        const todayStr = format(today, "yyyy-MM-dd")
        
        // If checked today, don't bother
        if (lastCheckStr === todayStr) return

        let shouldRemind = false
        let missedDate = null

        if (!lastCheckStr) {
            // First time ever? Just check today.
            if (isMonday(today) || isLastDayOfMonth(today)) {
                shouldRemind = true
            }
        } else {
            // Check all days since last check until today (inclusive)
            let current = addDays(new Date(lastCheckStr), 1)
            while (!isAfter(current, today)) {
                if (isMonday(current) || isLastDayOfMonth(current)) {
                    shouldRemind = true
                    missedDate = current
                    // We stop at first found trigger to avoid spam, or show the latest?
                    // Requirement: "remind if user didn't open app". 
                    // Let's just show one reminder.
                }
                current = addDays(current, 1)
            }
        }

        if (shouldRemind) {
            // Prepare message
            const progress = (balance / goal) * 100
            let msg = ""
            
            if (progress >= 100) {
                msg = "太棒了！你的存钱目标已达成 🎉 继续保持这份自律！"
                setTimeout(() => {
                    confetti({
                        particleCount: 150,
                        spread: 60
                    })
                }, 500)
            } else if (progress >= 70) {
                msg = `加油！本月存钱目标已完成 ${progress.toFixed(0)}%，胜利就在眼前！`
            } else if (progress >= 30) {
                msg = `已经完成 ${progress.toFixed(0)}% 啦！积少成多，坚持就是胜利 ✨`
            } else {
                msg = "新的一周/月，记得关注存钱进度哦！理财第一步，从存钱开始 💪"
            }

            setMessage(msg)
            setOpen(true)
            localStorage.setItem("last-savings-check", todayStr)
        } else {
            // Just update the check date
            localStorage.setItem("last-savings-check", todayStr)
        }

    }, [enabled, goal, balance])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                        <PiggyBank className="w-6 h-6 text-pink-600" />
                    </div>
                    <DialogTitle className="text-center text-xl">存钱提醒</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center">
                    <Button 
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl" 
                        onClick={() => setOpen(false)}
                    >
                        我知道了
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

