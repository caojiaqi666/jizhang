"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, Wallet, ArrowRight, Sparkles, BookOpen, Target, Zap, Calendar, Coffee, ShoppingBag, Plane, User } from "lucide-react"

export default function DiscoveryPage() {
  return (
    <div className="p-4 pb-24 space-y-6 pt-[calc(1rem+env(safe-area-inset-top))]">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">发现灵感</h1>
        <p className="text-sm text-gray-500 mt-1">让存钱变得有趣，让生活更有质感</p>
      </header>

      {/* Savings Challenge Section */}
      <section>
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-teal-500" /> 存钱挑战
            </h2>
            <span className="text-xs text-teal-600 font-medium cursor-pointer hover:text-teal-700">查看全部</span>
         </div>
         <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]">
               <CardContent className="p-4 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center mb-3 text-xl shadow-sm">💰</div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">365天存钱法</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">每天存入1~365元，一年可存6.6万</p>
                  <div className="mt-3 flex items-center text-[11px] text-orange-600 font-medium">
                     立即开始 <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
               </CardContent>
               <div className="absolute -right-2 -bottom-4 text-[80px] opacity-5 select-none font-bold">365</div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]">
               <CardContent className="p-4 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center mb-3 text-xl shadow-sm">📅</div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">52周存钱法</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">每周递增金额，轻松无痛攒钱</p>
                  <div className="mt-3 flex items-center text-[11px] text-blue-600 font-medium">
                     立即开始 <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
               </CardContent>
               <div className="absolute -right-2 -bottom-4 text-[80px] opacity-5 select-none font-bold">52</div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]">
               <CardContent className="p-4 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center mb-3 text-xl shadow-sm">💪</div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">21天极简存钱</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">每天存固定金额，养成存钱习惯</p>
                  <div className="mt-3 flex items-center text-[11px] text-purple-600 font-medium">
                     立即开始 <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
               </CardContent>
               <div className="absolute -right-2 -bottom-4 text-[80px] opacity-5 select-none font-bold">21</div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]">
               <CardContent className="p-4 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center mb-3 text-xl shadow-sm">🎯</div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">目标导向存钱</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">为梦想设定目标，分步实现</p>
                  <div className="mt-3 flex items-center text-[11px] text-green-600 font-medium">
                     立即开始 <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
               </CardContent>
               <div className="absolute -right-2 -bottom-4 text-[80px] opacity-5 select-none font-bold">💯</div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-red-50 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]">
               <CardContent className="p-4 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center mb-3 text-xl shadow-sm">🌟</div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">随机金额存钱</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">每次随机金额，增加趣味性</p>
                  <div className="mt-3 flex items-center text-[11px] text-rose-600 font-medium">
                     立即开始 <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
               </CardContent>
               <div className="absolute -right-2 -bottom-4 text-[80px] opacity-5 select-none font-bold">🎲</div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-teal-50 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]">
               <CardContent className="p-4 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-100 flex items-center justify-center mb-3 text-xl shadow-sm">📊</div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">预算百分比法</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">收入的固定比例自动存储</p>
                  <div className="mt-3 flex items-center text-[11px] text-cyan-600 font-medium">
                     立即开始 <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
               </CardContent>
               <div className="absolute -right-2 -bottom-4 text-[80px] opacity-5 select-none font-bold">%</div>
            </Card>
         </div>
      </section>

      {/* Financial Tips Section */}
      <section>
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
               <BookOpen className="w-5 h-5 text-purple-500" /> 理财干货
            </h2>
            <span className="text-xs text-purple-600 font-medium cursor-pointer hover:text-purple-700">更多文章</span>
         </div>
         
         <div className="space-y-3">
             <Card className="border-0 shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]">
                <div className="h-36 bg-gradient-to-br from-indigo-400 to-purple-500 w-full relative flex items-center justify-center">
                    <div className="text-white text-center px-4">
                        <div className="text-4xl mb-2">💰</div>
                        <div className="text-sm font-bold">理财第一课</div>
                    </div>
                    <Badge className="absolute top-3 left-3 bg-white/90 hover:bg-white text-purple-700 border-0 text-[10px] font-bold shadow-sm">
                        热门推荐
                    </Badge>
                </div>
                <CardContent className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">月薪5000如何存下第一桶金？</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                        不需要苦行僧式的生活，只需要掌握这3个记账原则，你也能轻松实现财务自由的第一步...
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">5分钟阅读</span>
                        <span className="text-xs text-purple-600 font-medium flex items-center">
                            阅读全文 <ArrowRight className="w-3 h-3 ml-1" />
                        </span>
                    </div>
                </CardContent>
             </Card>

             <Card className="border-0 shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]">
                <div className="flex">
                    <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-pink-500 shrink-0 flex items-center justify-center">
                        <div className="text-white text-3xl">📈</div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                            <Badge className="mb-2 bg-orange-100 hover:bg-orange-100 text-orange-700 border-0 text-[10px]">
                                新手必读
                            </Badge>
                            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">记账3个月后，我发现了这些省钱秘诀</h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">3分钟阅读</span>
                            <ArrowRight className="w-4 h-4 text-orange-500" />
                        </div>
                    </div>
                </div>
             </Card>

             <Card className="border-0 shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]">
                <div className="flex">
                    <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-teal-500 shrink-0 flex items-center justify-center">
                        <div className="text-white text-3xl">🎯</div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                            <Badge className="mb-2 bg-green-100 hover:bg-green-100 text-green-700 border-0 text-[10px]">
                                实用技巧
                            </Badge>
                            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">理财达人的7个记账好习惯</h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">4分钟阅读</span>
                            <ArrowRight className="w-4 h-4 text-green-500" />
                        </div>
                    </div>
                </div>
             </Card>

             <Card className="border-0 shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]">
                <div className="flex">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-cyan-500 shrink-0 flex items-center justify-center">
                        <div className="text-white text-3xl">💡</div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                            <Badge className="mb-2 bg-blue-100 hover:bg-blue-100 text-blue-700 border-0 text-[10px]">
                                进阶教程
                            </Badge>
                            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">如何制定年度理财计划？</h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">6分钟阅读</span>
                            <ArrowRight className="w-4 h-4 text-blue-500" />
                        </div>
                    </div>
                </div>
             </Card>
         </div>
      </section>

      {/* Quick Templates Section */}
      <section>
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
               <Zap className="w-5 h-5 text-yellow-500" /> 快速记账
            </h2>
            <span className="text-xs text-yellow-600 font-medium cursor-pointer hover:text-yellow-700">全部模板</span>
         </div>
         
         <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-yellow-50 cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]">
               <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shadow-sm">
                        <Coffee className="w-5 h-5 text-amber-600" />
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-gray-800">日常餐饮</h3>
                        <p className="text-[10px] text-gray-500">常用金额</p>
                     </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                     <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">¥15</span>
                     <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">¥30</span>
                     <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">¥50</span>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-sky-50 cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]">
               <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-blue-600" />
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-gray-800">通勤交通</h3>
                        <p className="text-[10px] text-gray-500">常用金额</p>
                     </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                     <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">¥5</span>
                     <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">¥10</span>
                     <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">¥20</span>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-pink-50 to-rose-50 cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]">
               <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center shadow-sm">
                        <ShoppingBag className="w-5 h-5 text-pink-600" />
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-gray-800">购物娱乐</h3>
                        <p className="text-[10px] text-gray-500">常用金额</p>
                     </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                     <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">¥50</span>
                     <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">¥100</span>
                     <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">¥200</span>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-violet-50 to-purple-50 cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]">
               <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shadow-sm">
                        <Plane className="w-5 h-5 text-violet-600" />
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-gray-800">旅行出游</h3>
                        <p className="text-[10px] text-gray-500">常用金额</p>
                     </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                     <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">¥500</span>
                     <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">¥1000</span>
                     <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 shadow-sm">¥2000</span>
                  </div>
               </CardContent>
            </Card>
         </div>
      </section>

      {/* Community Stories Section */}
      <section>
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
               <Sparkles className="w-5 h-5 text-pink-500" /> 社区分享
            </h2>
            <span className="text-xs text-pink-600 font-medium cursor-pointer hover:text-pink-700">更多故事</span>
         </div>
         
         <div className="space-y-3">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.98]">
               <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                        李
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="text-sm font-bold text-gray-900">小李存钱记</h3>
                           <Badge className="bg-pink-100 hover:bg-pink-100 text-pink-700 border-0 text-[10px]">
                              已存 3.2万
                           </Badge>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          "坚持记账365天，从月光族变成了存钱小能手！现在每个月都能存下30%的收入，感觉太棒了！"
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-gray-400">
                     <span>📅 记账 365 天</span>
                     <span>💰 累计存款 ¥32,000</span>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.98]">
               <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                        王
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="text-sm font-bold text-gray-900">王先生的理财日记</h3>
                           <Badge className="bg-blue-100 hover:bg-blue-100 text-blue-700 border-0 text-[10px]">
                              已存 5.8万
                           </Badge>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          "用52周存钱法一年存了58000元！每周递增存钱，完全不会感到压力，强烈推荐给大家！"
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-gray-400">
                     <span>📅 记账 420 天</span>
                     <span>💰 累计存款 ¥58,000</span>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.98]">
               <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                        张
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="text-sm font-bold text-gray-900">张小姐的存钱挑战</h3>
                           <Badge className="bg-purple-100 hover:bg-purple-100 text-purple-700 border-0 text-[10px]">
                              已存 6.6万
                           </Badge>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          "365天存钱挑战成功完成！从每天1元到365元，一年存够了人生第一个6万！下一个目标是10万！"
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-gray-400">
                     <span>📅 记账 365 天</span>
                     <span>💰 累计存款 ¥66,795</span>
                  </div>
               </CardContent>
            </Card>
         </div>
      </section>

      {/* Motivational Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white overflow-hidden relative">
         <CardContent className="p-6 relative z-10">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-bold mb-2">开始你的存钱之旅</h3>
            <p className="text-sm opacity-90 mb-4">
               选择一个适合你的存钱挑战，让记账变得更有趣！
            </p>
            <button className="bg-white text-teal-600 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95">
               立即开始
            </button>
         </CardContent>
         <div className="absolute -right-8 -bottom-8 text-[140px] opacity-10 select-none">💰</div>
      </Card>
    </div>
  )
}
