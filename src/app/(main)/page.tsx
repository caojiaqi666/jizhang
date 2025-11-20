"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Eye, HelpCircle } from "lucide-react"
import { getDashboardData, DashboardData } from "@/app/actions/finance"
import { useEffect, useState } from "react"
import { format, isToday, isYesterday } from "date-fns"
import { zhCN } from "date-fns/locale"
import { CATEGORIES } from "@/components/category-grid"
import { MOODS } from "@/components/mood-selector"
import { useTheme, THEME_COLORS } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { LedgerSwitcher } from "@/components/ledger-switcher"
import { useLedger } from "@/components/ledger-provider"
import { SavingsCard } from "@/components/savings-card"
import { useMembership } from "@/components/membership-provider"
import { SavingsReminder } from "@/components/savings-reminder"

// Helper to get icon component
const getCategoryIcon = (iconId: string) => {
    const cat = CATEGORIES.find(c => c.id === iconId)
    return cat ? cat.icon : HelpCircle
}
const getCategoryColor = (iconId: string) => {
    const cat = CATEGORIES.find(c => c.id === iconId)
    return cat ? cat.color : "bg-gray-100 text-gray-600"
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [hidden, setHidden] = useState(false)
  const { primaryColor, backgroundImage } = useTheme()
  const { currentLedger } = useLedger()
  const { profile } = useMembership()

  const fetchData = async () => {
      if (!currentLedger) return
      setLoading(true)
      try {
          const res = await getDashboardData(currentLedger.id)
          setData(res)
      } catch (e) {
          console.error(e)
      } finally {
          setLoading(false)
      }
  }

  useEffect(() => {
      fetchData()
      
      // Refresh when window gets focus or custom event
      window.addEventListener('focus', fetchData)
      window.addEventListener('transaction-updated', fetchData)
      return () => {
          window.removeEventListener('focus', fetchData)
          window.removeEventListener('transaction-updated', fetchData)
      }
  }, [currentLedger]) // Re-fetch when ledger changes

  // Group transactions by date
  const groupedTransactions = data?.transactions.reduce((acc, t) => {
      const dateKey = format(new Date(t.date), 'yyyy-MM-dd')
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(t)
      return acc
  }, {} as Record<string, any[]>)

  const gradientClass = THEME_COLORS[primaryColor] || THEME_COLORS.teal

  return (
    <main className="flex flex-col h-full relative">
      {/* Header / Asset Card */}
      <header
        className={cn(
          "relative overflow-hidden text-white p-6 pt-12 pb-10 rounded-b-[32px] shadow-lg z-10 transition-all duration-500 ease-out",
          gradientClass
        )}
      >
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url(${backgroundImage})` }}
          />
        )}
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <LedgerSwitcher />
            <div
              className="bg-white/20 p-2 rounded-full backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors"
              onClick={() => setHidden(!hidden)}
            >
              <Eye className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="mb-6">
            <div className="text-white/80 text-xs mb-1 opacity-80">本月结余</div>
            <div className="text-4xl font-bold tracking-tight font-mono">
              {loading ? "..." : hidden ? "****" : `¥ ${data?.balance.toFixed(2)}`}
            </div>
          </div>

          <div className="flex gap-8">
            <div>
              <div className="text-white/80 text-xs mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span> 本月收入
              </div>
              <div className="text-lg font-semibold font-mono">
                {loading ? "..." : hidden ? "****" : `¥ ${data?.income.toFixed(2)}`}
              </div>
            </div>
            <div>
              <div className="text-white/80 text-xs mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span> 本月支出
              </div>
              <div className="text-lg font-semibold font-mono">
                {loading ? "..." : hidden ? "****" : `¥ ${data?.expense.toFixed(2)}`}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Transaction List */}
      <div className="flex-1 -mt-0 px-4 overflow-y-auto">
         <div className="mb-4 pt-2">
            <SavingsCard 
                goal={profile?.monthly_savings_goal || 0} 
                balance={data?.balance || 0} 
                visible={!!profile?.monthly_savings_enabled && !!currentLedger?.is_default} 
            />
         </div>
         
         {/* Reminder */}
         <SavingsReminder 
            enabled={!!profile?.monthly_savings_enabled}
            goal={profile?.monthly_savings_goal || 0}
            balance={data?.balance || 0}
         />

         {loading ? (
             <div className="text-center text-gray-400 text-xs mt-10">加载中...</div>
         ) : !data?.transactions.length ? (
             <div className="text-center text-gray-400 text-xs mt-10">本月暂无账单，记一笔吧～</div>
         ) : (
             <div className="space-y-6 pb-4 pt-4">
                {(Object.entries(groupedTransactions || {}) as [string, any[]][]).map(([date, items]) => {
                    let dateLabel = format(new Date(date), 'M月d日', { locale: zhCN })
                    if (isToday(new Date(date))) dateLabel = "今天"
                    if (isYesterday(new Date(date))) dateLabel = "昨天"

                    return (
                        <div key={date}>
                            <div className="text-xs text-gray-500 font-medium px-2 mb-2">{dateLabel}</div>
                            <div className="space-y-3">
                                {items.map((t) => {
                                    const Icon = getCategoryIcon(t.categories?.icon || 'other')
                                    const colorClass = getCategoryColor(t.categories?.icon || 'other')
                                    const moodEmoji = MOODS.find(m => m.id === t.mood)?.emoji || ''

                                    return (
                                        <Card key={t.id} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm">
                                            <CardContent className="p-4 flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-800 flex items-center gap-2">
                                                    {t.categories?.name}
                                                    {t.note && <span className="text-xs font-normal text-gray-400 truncate max-w-[100px]">{t.note}</span>}
                                                </div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <span>{moodEmoji}</span>
                                                    <span>{format(new Date(t.date), 'HH:mm')}</span>
                                                </div>
                                            </div>
                                            <div className={`font-mono font-semibold ${Number(t.amount) > 0 ? 'text-emerald-600' : 'text-gray-800'}`}>
                                                {Number(t.amount) > 0 ? '+' : ''}{t.amount}
                                            </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
             </div>
         )}
      </div>
    </main>
  )
}
