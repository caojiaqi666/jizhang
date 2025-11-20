"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, LogOut, Trash2, CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

export default function SettingsPage() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const handleClearData = () => {
      // In real app, this would call a server action to DELETE FROM transactions
      toast.error("为了您的数据安全，演示版暂不支持清空数据")
  }

  const handleAddReminder = () => {
      // Simple "Add to Calendar" link for a recurring event
      // This is a quick way to set reminders without Push Notifications
      const event = {
          title: "记账时间 - FlowMoney",
          details: "记得记录今天的美好与开销哦！",
          // Recurring rule not standard in simple links, but we can open calendar app
      }
      // Webcal or Google Calendar link
      window.open("https://calendar.google.com/calendar/u/0/r/eventedit?text=记账时间&details=FlowMoney提醒&recur=RRULE:FREQ=DAILY", "_blank")
  }

  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-screen">
      <header className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">通用设置</h1>
      </header>

      <div className="space-y-6">
        {/* Account Section */}
        <section className="space-y-2">
            <h2 className="text-xs font-bold text-gray-500 px-2">账号安全</h2>
            <Card className="border-0 shadow-sm">
                <CardContent className="p-0 divide-y divide-gray-50">
                    <div className="p-4 flex items-center justify-between">
                        <span className="text-sm text-gray-700">当前账号</span>
                        <span className="text-sm text-gray-400">已登录</span>
                    </div>
                    <div 
                        className="p-4 flex items-center gap-3 text-red-500 cursor-pointer active:bg-red-50"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">退出登录</span>
                    </div>
                </CardContent>
            </Card>
        </section>

        {/* Features Section */}
        <section className="space-y-2">
            <h2 className="text-xs font-bold text-gray-500 px-2">功能增强</h2>
            <Card className="border-0 shadow-sm">
                <CardContent className="p-0 divide-y divide-gray-50">
                    <div 
                        className="p-4 flex items-center justify-between cursor-pointer active:bg-gray-50"
                        onClick={handleAddReminder}
                    >
                        <div className="flex items-center gap-3">
                            <CalendarPlus className="w-4 h-4 text-teal-600" />
                            <span className="text-sm font-medium text-gray-700">添加到日历提醒</span>
                        </div>
                        <span className="text-xs text-gray-400">每日</span>
                    </div>
                </CardContent>
            </Card>
        </section>

        {/* Danger Zone */}
        <section className="space-y-2">
            <h2 className="text-xs font-bold text-gray-500 px-2">危险区域</h2>
            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <div 
                        className="p-4 flex items-center gap-3 text-red-500 cursor-pointer active:bg-red-50"
                        onClick={handleClearData}
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">清空所有数据</span>
                    </div>
                </CardContent>
            </Card>
        </section>
        
        <div className="text-center pt-8">
            <p className="text-xs text-gray-400">FlowMoney v1.0.0</p>
            <p className="text-[10px] text-gray-300 mt-1">Designed for Inner Peace</p>
        </div>
      </div>
    </div>
  )
}

