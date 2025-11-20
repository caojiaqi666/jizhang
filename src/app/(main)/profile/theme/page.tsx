"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeSelector } from "@/components/theme-selector"
import { useMembership } from "@/components/membership-provider"
import { ProFeatureWall } from "@/components/pro-feature-wall"

export default function ThemeSettingsPage() {
  const router = useRouter()
  const { isPro, loading } = useMembership()

  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-screen">
      <header className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900">个性化主题</h1>
      </header>

      {loading ? (
        <div className="text-center text-sm text-gray-400 mt-20">加载中...</div>
      ) : isPro ? (
        <ThemeSelector />
      ) : (
        <ProFeatureWall
          title="主题皮肤为 Pro 专享"
          description="解锁自定义主色与背景图，打造只属于你的 FlowMoney 氛围感。"
          highlight="升级即可同步主题到所有设备"
        />
      )}
    </div>
  )
}

