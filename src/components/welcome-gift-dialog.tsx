"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"
import confetti from "canvas-confetti"

export function WelcomeGiftDialog({ show }: { show: boolean }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (show) {
      setOpen(true)
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 }

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        
        confetti({
          ...defaults, 
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults, 
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)
    }
  }, [show])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-yellow-50 to-orange-100 border-0 p-0 overflow-hidden">
        <div className="relative p-8 flex flex-col items-center text-center">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-400/20 to-transparent" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300/30 rounded-full blur-3xl" />
            
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-xl mb-6 z-10">
                <Crown className="w-10 h-10 text-white fill-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2 z-10">欢迎加入 FlowMoney!</h2>
            <p className="text-gray-600 mb-6 z-10">
                新人专享好礼已送达
            </p>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 w-full mb-6 border border-white/50 shadow-sm z-10">
                <div className="text-sm text-gray-500 mb-1">获赠</div>
                <div className="text-xl font-bold text-yellow-700 flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5 fill-yellow-700" />
                    7天 Pro 会员体验
                </div>
                <div className="text-xs text-gray-400 mt-2">
                    无限账本 · 数据导出 · 专属主题
                </div>
            </div>
            
            <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg z-10"
                onClick={() => setOpen(false)}
            >
                立即开启体验
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

