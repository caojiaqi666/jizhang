"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Crown, Check, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { upgradeToPro } from "@/app/actions/user"
import { toast } from "sonner"
import { useState } from "react"
import confetti from "canvas-confetti"
import { useMembership } from "@/components/membership-provider"

export default function ProPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { isPro, refreshProfile: refresh } = useMembership()

  const handleUpgrade = async () => {
      setLoading(true)
      try {
          await upgradeToPro()
          await refresh()
          confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#FFD700', '#FFA500', '#FF4500']
          })
          toast.success("尊贵的 Pro 会员，欢迎您！")
      } catch (e) {
          toast.error("升级失败")
      } finally {
          setLoading(false)
      }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-24">
      <header className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold">FlowMoney Pro</h1>
      </header>

      <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">解锁无限可能</h2>
          <p className="text-gray-400 text-sm">投资自己，从记录每一笔财富开始</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto mb-10">
          {[
              "多账本管理，公私分明",
              "无限历史数据存储与导出",
              "高级情绪分析报表",
              "移除所有广告（虽然本来就没有）",
              "专属 Pro 会员徽章"
          ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="bg-green-500/20 p-1.5 rounded-full">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">{feature}</span>
              </div>
          ))}
      </div>

      <div className="fixed bottom-10 left-4 right-4 max-w-md mx-auto">
          {isPro ? (
              <Button className="w-full h-12 bg-gray-800 text-yellow-500 font-bold border border-yellow-500/50 cursor-default">
                  <Crown className="w-4 h-4 mr-2 fill-current" />
                  您已是尊贵的 Pro 会员
              </Button>
          ) : (
            <Button 
                className="w-full h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold text-lg shadow-lg shadow-yellow-500/20 transition-all active:scale-95"
                onClick={handleUpgrade}
                disabled={loading}
            >
                {loading ? "处理中..." : "立即升级 - ¥19.9/永久"}
                {!loading && <Zap className="w-4 h-4 ml-2 fill-black" />}
            </Button>
          )}
          <p className="text-center text-[10px] text-gray-600 mt-3">
              点击即代表同意《会员服务协议》
          </p>
      </div>
    </div>
  )
}

