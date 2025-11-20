"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { CategoryChart } from "@/components/charts/category-chart"
import { MoodAnalysis } from "@/components/charts/mood-analysis"
import { getStatsData, StatsFilter } from "@/app/actions/finance"
import { FilterDrawer } from "@/components/filter-drawer"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { useLedger } from "@/components/ledger-provider"
import { useTheme, THEME_COLORS } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export default function StatsPage() {
  const { currentLedger, ledgers } = useLedger()
  const { primaryColor } = useTheme()
  const [filter, setFilter] = useState<StatsFilter>({
      range: 'month',
      type: 'expense',
      date: new Date().toISOString()
  })
  const [selectedLedgerId, setSelectedLedgerId] = useState<string | undefined>(undefined)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Sync selected ledger with context initially
  useEffect(() => {
      if (currentLedger && !selectedLedgerId) {
          setSelectedLedgerId(currentLedger.id)
      }
  }, [currentLedger])

  useEffect(() => {
      if (!selectedLedgerId) return

      const loadData = async () => {
          setLoading(true)
          try {
             const res = await getStatsData(filter, selectedLedgerId)
             setData(res)
          } catch (e) {
              console.error(e)
          } finally {
              setLoading(false)
          }
      }
      loadData()
  }, [filter, selectedLedgerId])

  const typeLabel = filter.type === 'expense' ? '支出' : '收入'
  const dateLabel = format(new Date(filter.date), 'yyyy年MM月', { locale: zhCN })
  const ledgerName = ledgers.find(l => l.id === selectedLedgerId)?.name || '默认账本'
  const gradientClass = THEME_COLORS[primaryColor] || THEME_COLORS.teal

  return (
    <div className="p-4 pb-4 space-y-6">
      <header 
        className={cn(
            "flex items-center justify-between p-6 rounded-[32px] shadow-lg text-white mb-6 transition-all duration-500",
            gradientClass
        )}
      >
        <div>
            <h1 className="text-xl font-bold text-white/90">统计分析</h1>
            <p className="text-xs text-white/70 mt-1 flex items-center gap-2">
                <span className="bg-white/20 px-2 py-0.5 rounded-full">{ledgerName}</span>
                <span>{dateLabel}</span>
                <span>{typeLabel}</span>
            </p>
        </div>
        <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full h-8 gap-1 bg-white/20 text-white hover:bg-white/30 border-0"
            onClick={() => setIsFilterOpen(true)}
        >
            <Filter className="w-3 h-3" />
            筛选
        </Button>
      </header>

      <FilterDrawer 
        open={isFilterOpen} 
        onOpenChange={setIsFilterOpen}
        filter={filter}
        onFilterChange={setFilter}
        ledgerId={selectedLedgerId}
        onLedgerChange={setSelectedLedgerId}
      />

      {/* Summary Card */}
      <div className="grid grid-cols-1 gap-4">
        <Card className={`border-0 shadow-sm ${filter.type === 'income' ? 'bg-teal-50/50' : 'bg-orange-50/50'}`}>
          <CardContent className="p-4 flex justify-between items-center">
             <div>
                <div className={`text-xs mb-1 ${filter.type === 'income' ? 'text-teal-600' : 'text-orange-600'}`}>
                    总{typeLabel}
                </div>
                <div className={`text-2xl font-bold font-mono ${filter.type === 'income' ? 'text-teal-700' : 'text-orange-700'}`}>
                    {loading ? "..." : `¥ ${data?.totalAmount.toFixed(2)}`}
                </div>
             </div>
             <div className={`text-[10px] px-2 py-1 rounded-full ${filter.type === 'income' ? 'text-teal-600 bg-white/60' : 'text-orange-400 bg-white/50'}`}>
                 共 {data?.categoryStats.length} 类
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
           <CardTitle className="text-base font-medium text-gray-800">{typeLabel}构成</CardTitle>
        </CardHeader>
        <CardContent>
           <CategoryChart data={data?.categoryStats || []} />
        </CardContent>
      </Card>

      {/* Mood Analysis (Featured) */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
           <CardTitle className="text-base font-medium text-gray-800">情绪账单</CardTitle>
        </CardHeader>
        <CardContent>
           <MoodAnalysis data={data?.moodStats || []} />
        </CardContent>
      </Card>
    </div>
  )
}
