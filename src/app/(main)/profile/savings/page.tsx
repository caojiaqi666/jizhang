"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, PiggyBank, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMembership } from "@/components/membership-provider"
import { updateSavingsSettings } from "@/app/actions/user"
import { useTheme, THEME_VARIANTS } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export default function SavingsPage() {
  const router = useRouter()
  const { profile, loading, refreshProfile, isPro } = useMembership()
  const { primaryColor } = useTheme()
  const theme = THEME_VARIANTS[primaryColor]
  const [enabled, setEnabled] = useState(false)
  const [goal, setGoal] = useState("0")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
      // Pro Check
      if (!loading && !isPro) {
          toast.error("存钱罐为 Pro 会员专享功能")
          router.replace('/profile/pro')
          return
      }

      if (profile) {
          setEnabled(profile.monthly_savings_enabled || false)
          setGoal(profile.monthly_savings_goal?.toString() || "0")
      }
  }, [profile, isPro, loading, router])

  const handleSave = async () => {
      setSaving(true)
      try {
          const goalNum = parseFloat(goal)
          if (isNaN(goalNum) || goalNum < 0) {
              toast.error("请输入有效的金额")
              return
          }
          
          const res = await updateSavingsSettings(enabled, goalNum)
          if (res.success) {
              toast.success("存钱计划已更新")
              await refreshProfile()
              router.back()
          } else {
              toast.error("保存失败: " + res.error)
          }
      } catch (e) {
          toast.error("保存失败")
      } finally {
          setSaving(false)
      }
  }

  if (loading) return <div className="p-4 text-center text-gray-500">加载中...</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-[env(safe-area-inset-top)]">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-4 h-14 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="-ml-2" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-bold text-lg">存钱罐设置</h1>
      </header>

      <main className="p-4 space-y-6">
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", theme.lightBg)}>
                            <PiggyBank className={cn("w-5 h-5", theme.text)} />
                        </div>
                        <div>
                            <CardTitle className="text-base">开启存钱计划</CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                                设定每月目标，追踪存钱进度
                            </CardDescription>
                        </div>
                    </div>
                    <Switch 
                        checked={enabled} 
                        onCheckedChange={setEnabled} 
                        className={cn("data-[state=checked]:bg-current", theme.text)}
                    />
                </div>
            </CardHeader>
        </Card>

        {enabled && (
            <Card className="border-0 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="goal">每月存钱目标 (元)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-mono">¥</span>
                                <Input 
                                    id="goal"
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    className="pl-8 text-xl font-mono font-bold h-12"
                                    type="number"
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="text-xs text-gray-400">
                                目标将用于计算每月的存钱进度（收入 - 支出）
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}

        <Button 
            className={cn("w-full h-12 text-base font-bold text-white rounded-xl shadow-lg mt-8", theme.bg)}
            onClick={handleSave}
            disabled={saving}
        >
            {saving ? "保存中..." : "保存设置"}
        </Button>
      </main>
    </div>
  )
}

