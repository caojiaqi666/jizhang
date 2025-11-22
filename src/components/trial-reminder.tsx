"use client"

import { useEffect, useMemo, useState } from "react"
import { useMembership } from "@/components/membership-provider"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export function TrialReminder() {
  const { loading, isTrial, trialDaysLeft, profile } = useMembership()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (loading || !isTrial || !profile?.id) return

    const today = new Date().toISOString().slice(0, 10)
    const storageKey = `flowmoney-trial-reminder-${profile.id}`
    const lastShown = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null

    if (lastShown === today) return

    localStorage.setItem(storageKey, today)
    setOpen(true)
  }, [loading, isTrial, profile?.id])

  const progressValue = useMemo(() => {
    if (!profile?.trial_started_at || !profile?.trial_ends_at) return 0
    const total = new Date(profile.trial_ends_at).getTime() - new Date(profile.trial_started_at).getTime()
    if (total <= 0) return 0
    
    const now = Date.now()
    const endsAt = new Date(profile.trial_ends_at).getTime()
    const remaining = Math.max(0, endsAt - now)
    
    return Math.min(100, Math.max(0, (remaining / total) * 100))
  }, [profile?.trial_started_at, profile?.trial_ends_at])

  if (!isTrial) return null

  const daysText = trialDaysLeft <= 1 ? "最后一天" : `还剩 ${trialDaysLeft} 天`

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm border-0 rounded-3xl bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/90 text-white backdrop-blur-2xl px-6 py-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 flex items-center justify-center text-yellow-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-200/70">Pro 体验</p>
            <h2 className="text-xl font-bold">你的 Pro 会员 {daysText}</h2>
          </div>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed">
          解锁多账本、主题皮肤、导出等高级功能。体验结束后将恢复为普通用户，别忘了升级保留特权。
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>剩余体验</span>
            <span>{Math.round(progressValue)}%</span>
          </div>
          <Progress 
            value={progressValue} 
            className="h-2 bg-white/10" 
            indicatorClassName="bg-gradient-to-r from-red-500 via-orange-500 to-green-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 font-semibold shadow-lg shadow-yellow-500/30"
            onClick={() => {
              setOpen(false)
              router.push("/profile/pro")
            }}
          >
            立即升级，永久 Pro
          </Button>
          <Button
            variant="ghost"
            className="w-full h-11 rounded-2xl bg-white/5 hover:bg-white/10 text-white"
            onClick={() => setOpen(false)}
          >
            我知道了
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

