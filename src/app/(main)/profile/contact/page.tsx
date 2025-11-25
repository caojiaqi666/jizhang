"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, QrCode } from "lucide-react"

export default function ContactAuthorPage() {
  const router = useRouter()

  return (
    <div className="p-4 pb-24 min-h-screen bg-gray-50 flex flex-col gap-6 pt-[calc(1rem+env(safe-area-inset-top))]">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          联系作者
        </h1>
      </header>

      <section className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">微信扫码加我</h2>
          <p className="text-xs text-gray-500 mt-1">欢迎反馈问题、提需求或交流想法</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <Image
            src="/wx.jpeg"
            alt="联系作者微信二维码"
            width={600}
            height={800}
            className="w-full h-auto"
            priority
          />
        </div>
      </section>
    </div>
  )
}

