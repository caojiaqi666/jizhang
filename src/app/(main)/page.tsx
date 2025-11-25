"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Eye, HelpCircle } from "lucide-react"
import { getDashboardData, DashboardData } from "@/app/actions/finance"
import { useEffect, useState } from "react"
import { format, isToday, isYesterday } from "date-fns"
import { zhCN } from "date-fns/locale"
import { CATEGORIES } from "@/components/category-grid"
import { MOODS } from "@/components/mood-selector"
import { useTheme, THEME_VARIANTS } from "@/components/theme-provider"
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
// Using pastel backgrounds for icon boxes
const getCategoryColor = (iconId: string) => {
    const cat = CATEGORIES.find(c => c.id === iconId)
    // Use the existing logic but maybe we can force a pastel background if the class allows
    // Current cat.color usually looks like "bg-red-100 text-red-600" which is already pastel-ish
    return cat ? cat.color : "bg-[#F5F7FA] text-gray-600"
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [hidden, setHidden] = useState(false)
  const { primaryColor, backgroundImage } = useTheme()
  const { currentLedger, loading: ledgerLoading } = useLedger()
  const { profile } = useMembership()
  const theme = THEME_VARIANTS[primaryColor]

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
      if (currentLedger) {
        fetchData()
      } else if (!ledgerLoading) {
        setLoading(false)
      }
      
      window.addEventListener('focus', fetchData)
      window.addEventListener('transaction-updated', fetchData)
      return () => {
          window.removeEventListener('focus', fetchData)
          window.removeEventListener('transaction-updated', fetchData)
      }
  }, [currentLedger, ledgerLoading])

  const groupedTransactions = data?.transactions.reduce((acc, t) => {
      const dateKey = format(new Date(t.date), 'yyyy-MM-dd')
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(t)
      return acc
  }, {} as Record<string, any[]>)

  return (
    <main className="flex flex-col h-full relative">
      {/* Header / Balance Card - Mochi Style */}
      <div className="px-6 pt-[calc(3rem+env(safe-area-inset-top))] pb-4 relative z-10">
        <div className="flex justify-between items-center mb-4 px-2">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl shadow-[var(--shadow-soft)] cursor-pointer active:scale-90 transition-transform">
                {/* Avatar Placeholder - cat emoji from 1.html */}
                🐱
            </div>
        </div>

        <div 
            className={cn(
                "relative overflow-hidden text-white p-6 rounded-[24px] shadow-lg transition-all duration-500 min-h-[140px] flex flex-col justify-center",
                theme.bg
            )}
            style={{ boxShadow: '0 8px 20px rgba(136, 216, 176, 0.4)' }} 
        >
            {/* Decorative Dot */}
            <div className="absolute -top-[10px] -right-[10px] w-[60px] h-[60px] rounded-full bg-white/20" />
            
            {backgroundImage && (
            <div
                className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            )}

            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-white/90 text-xs font-medium mb-1 opacity-90">本月剩余</div>
                        <div className="text-3xl font-extrabold tracking-wide font-nunito">
                            {loading ? "..." : hidden ? "****" : `¥ ${(data?.balance || 0).toFixed(2)}`}
                        </div>
                    </div>
                     <div
                        className="bg-white/20 p-1.5 rounded-full backdrop-blur-md cursor-pointer hover:bg-white/30 transition-colors"
                        onClick={() => setHidden(!hidden)}
                    >
                        <Eye className="w-4 h-4 text-white" />
                    </div>
                </div>
                
                {/* Ledger Name as a subtle tag */}
                <div className="mt-4 flex items-center gap-2">
                    <LedgerSwitcher className="bg-white/20 text-white border-none hover:bg-white/30 h-7 text-xs px-3" />
                </div>
            </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 px-6 pb-[100px] overflow-y-auto scrollbar-hide">
         <div className="mb-4">
            <SavingsCard 
                goal={profile?.monthly_savings_goal || 0} 
                balance={data?.balance || 0} 
                visible={!!profile?.monthly_savings_enabled && !!currentLedger?.is_default} 
            />
         </div>
         
         <SavingsReminder 
            enabled={!!profile?.monthly_savings_enabled}
            goal={profile?.monthly_savings_goal || 0}
            balance={data?.balance || 0}
         />

         {loading ? (
             <div className="text-center text-gray-400 text-xs mt-10 animate-pulse">加载中...</div>
         ) : !data?.transactions.length ? (
             <div className="text-center text-gray-400 text-sm mt-10 bg-white/50 p-8 rounded-[24px] border-2 border-dashed border-gray-200">
                <div className="text-4xl mb-4">📝</div>
                本月暂无账单，记一笔吧～
             </div>
         ) : (
             <div className="space-y-6 pb-4">
                {(Object.entries(groupedTransactions || {}) as [string, any[]][]).map(([date, items]) => {
                    let dateLabel = format(new Date(date), 'M月d日', { locale: zhCN })
                    if (isToday(new Date(date))) dateLabel = "今日" // Changed to match 1.html
                    if (isYesterday(new Date(date))) dateLabel = "昨日" // Changed to match 1.html

                    return (
                        <div key={date}>
                            <div className="text-[14px] text-[#9E9E9E] font-bold mt-6 mb-3">{dateLabel}</div>
                            <div className="space-y-3">
                                {items.map((t) => {
                                    const Icon = getCategoryIcon(t.categories?.icon || 'other')
                                    const colorClass = getCategoryColor(t.categories?.icon || 'other')
                                    const moodEmoji = MOODS.find(m => m.id === t.mood)?.emoji || ''
                                    const isExpense = t.type === 'expense' || t.amount < 0
                                    
                                    // Construct "Time · Label" string
                                    const timeStr = format(new Date(t.date), 'HH:mm')
                                    // If there's a mood or note, use it as label, otherwise just time
                                    const labelStr = t.note ? t.note : (moodEmoji ? (moodEmoji + " 心情") : (isExpense ? "支出" : "收入"))

                                    return (
                                        <div 
                                            key={t.id} 
                                            className="bg-card rounded-[20px] p-4 mb-3 flex items-center shadow-[var(--shadow-soft)] transition-transform active:scale-95 cursor-pointer border-0"
                                        >
                                            <div className={cn("w-12 h-12 rounded-[16px] flex items-center justify-center text-2xl mr-4", colorClass)}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[16px] text-[#5B5B5B] font-bold mb-1">
                                                    {t.categories?.name}
                                                </div>
                                                <div className="text-[12px] text-[#9E9E9E]">
                                                    {timeStr} · {labelStr}
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "text-[18px] font-extrabold font-nunito", 
                                                isExpense ? "text-expense" : "text-income"
                                            )}>
                                                {isExpense ? '-' : '+'}{Math.abs(Number(t.amount)).toFixed(2)}
                                            </div>
                                        </div>
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
