"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, Wallet, ArrowRight, Sparkles } from "lucide-react"

export default function DiscoveryPage() {
  return (
    <div className="p-4 pb-4 space-y-6">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">发现灵感</h1>
        <p className="text-xs text-gray-500 mt-1">让存钱变得有趣，让生活更有质感</p>
      </header>

      {/* Savings Challenge Section */}
      <section>
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1">
               <TrendingUp className="w-4 h-4 text-teal-500" /> 存钱挑战
            </h2>
            <span className="text-xs text-teal-600 font-medium">查看全部</span>
         </div>
         <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-orange-50 overflow-hidden relative group cursor-pointer">
               <CardContent className="p-4 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mb-3 text-lg">💰</div>
                  <h3 className="font-bold text-gray-800 text-sm">365天存钱法</h3>
                  <p className="text-[10px] text-gray-500 mt-1">每天存入1~365元，一年可存6.6万</p>
                  <div className="mt-3 flex items-center text-[10px] text-orange-600 font-medium">
                     立即开始 <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
               </CardContent>
               <div className="absolute -right-2 -bottom-4 text-[80px] opacity-5 select-none">365</div>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden relative group cursor-pointer">
               <CardContent className="p-4 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-3 text-lg">📅</div>
                  <h3 className="font-bold text-gray-800 text-sm">52周存钱法</h3>
                  <p className="text-[10px] text-gray-500 mt-1">每周递增金额，轻松无痛攒钱</p>
                  <div className="mt-3 flex items-center text-[10px] text-blue-600 font-medium">
                     立即开始 <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
               </CardContent>
               <div className="absolute -right-2 -bottom-4 text-[80px] opacity-5 select-none">52</div>
            </Card>
         </div>
      </section>

      {/* Inspiration Stream (Native Ads Placeholder) */}
      <section>
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1">
               <Sparkles className="w-4 h-4 text-purple-500" /> 生活精选
            </h2>
         </div>
         
         <div className="space-y-3">
             {/* Article Item */}
             <Card className="border-0 shadow-sm overflow-hidden">
                <div className="h-32 bg-gray-200 w-full relative">
                    {/* Placeholder Image */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                        封面图 (Cover Image)
                    </div>
                    <Badge className="absolute top-2 left-2 bg-black/50 hover:bg-black/50 border-0 text-white text-[10px]">
                        理财干货
                    </Badge>
                </div>
                <CardContent className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">月薪5000如何通过记账存下第一桶金？</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        不需要苦行僧式的生活，只需要掌握这3个记账原则，你也能轻松实现财务自由...
                    </p>
                </CardContent>
             </Card>

             {/* Ad Item (Native Style) */}
             <Card className="border-0 shadow-sm overflow-hidden">
                <div className="flex">
                    <div className="w-24 h-24 bg-gray-100 shrink-0 flex items-center justify-center text-gray-300 text-[10px]">
                        商品图
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 line-clamp-1">高颜值手帐本套装</h3>
                            <p className="text-xs text-gray-500 mt-1">记录生活的小确幸，送给热爱生活的你。</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-bold text-orange-600">¥ 39.9</span>
                            <span className="text-[10px] text-gray-300 border border-gray-200 px-1 rounded">广告</span>
                        </div>
                    </div>
                </div>
             </Card>
         </div>
      </section>
    </div>
  )
}

