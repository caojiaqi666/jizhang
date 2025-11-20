"use client"

import { Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ProFeatureWallProps {
  title: string
  description: string
  highlight?: string
  ctaLabel?: string
}

export function ProFeatureWall({
  title,
  description,
  highlight,
  ctaLabel = "解锁 FlowMoney Pro",
}: ProFeatureWallProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center text-center px-6 py-12 gap-6">
      <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-yellow-200/60 to-orange-500/60 flex items-center justify-center shadow-lg shadow-yellow-500/30">
        <Crown className="w-10 h-10 text-white" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        {highlight && <p className="text-sm font-medium text-yellow-600">{highlight}</p>}
      </div>
      <Button
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 font-semibold shadow-lg shadow-yellow-500/20"
        onClick={() => router.push("/profile/pro")}
      >
        {ctaLabel}
      </Button>
    </div>
  )
}

