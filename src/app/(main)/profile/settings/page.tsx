"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, LogOut, Trash2, CalendarPlus, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { logout } from "@/app/login/actions"
import { changePassword } from "@/app/actions/user"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  const router = useRouter()
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
        toast.error("新密码长度至少6位")
        return
    }
    if (newPassword !== confirmPassword) {
        toast.error("两次输入的新密码不一致")
        return
    }

    setIsSubmitting(true)
    try {
        const result = await changePassword(oldPassword, newPassword)
        if (result.success) {
            toast.success("密码修改成功，请重新登录")
            setIsChangePasswordOpen(false)
            await handleLogout()
        } else {
            toast.error(result.error || "修改失败")
        }
    } catch (e) {
        toast.error("修改失败")
    } finally {
        setIsSubmitting(false)
    }
  }

  const handleClearData = () => {
      toast.error("为了您的数据安全，演示版暂不支持清空数据")
  }

  const handleAddReminder = () => {
      window.open("https://calendar.google.com/calendar/u/0/r/eventedit?text=记账时间&details=FlowMoney提醒&recur=RRULE:FREQ=DAILY", "_blank")
  }

  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-screen pt-[calc(1rem+env(safe-area-inset-top))]">
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
                    
                    <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                        <DialogTrigger asChild>
                            <div className="p-4 flex items-center gap-3 cursor-pointer active:bg-gray-50">
                                <Lock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">修改密码</span>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>修改密码</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="old">旧密码</Label>
                                    <Input 
                                        id="old"
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="请输入旧密码"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new">新密码</Label>
                                    <Input 
                                        id="new"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="至少6位"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm">确认新密码</Label>
                                    <Input 
                                        id="confirm"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="再次输入新密码"
                                    />
                                </div>
                                <Button 
                                    className="w-full bg-teal-600 mt-2" 
                                    onClick={handleChangePassword}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "提交中..." : "确认修改"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

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
