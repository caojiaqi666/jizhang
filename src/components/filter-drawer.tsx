"use client"

import * as React from "react"
import { format, addMonths, subMonths } from "date-fns"
import { zhCN } from "date-fns/locale"
import { ChevronLeft, ChevronRight, X, Check, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { StatsFilter } from "@/app/actions/finance"
import { useLedger } from "@/components/ledger-provider"
import { cn } from "@/lib/utils"

interface FilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filter: StatsFilter
  onFilterChange: (newFilter: StatsFilter) => void
  ledgerId?: string
  onLedgerChange: (id: string) => void
}

export function FilterDrawer({ open, onOpenChange, filter, onFilterChange, ledgerId, onLedgerChange }: FilterDrawerProps) {
  const { ledgers } = useLedger()
  const [tempFilter, setTempFilter] = React.useState<StatsFilter>(filter)
  const [tempLedgerId, setTempLedgerId] = React.useState<string | undefined>(ledgerId)
  const currentDate = new Date(tempFilter.date)

  // Reset temp filter when opening
  React.useEffect(() => {
      if (open) {
          setTempFilter(filter)
          setTempLedgerId(ledgerId)
      }
  }, [open, filter, ledgerId])

  const handleMonthChange = (delta: number) => {
      const newDate = addMonths(currentDate, delta)
      setTempFilter(prev => ({ ...prev, date: newDate.toISOString() }))
  }

  const handleApply = () => {
      onFilterChange(tempFilter)
      if (tempLedgerId) onLedgerChange(tempLedgerId)
      onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-[32px] max-h-[85vh]">
        <DrawerHeader className="flex items-center justify-between border-b px-4 py-3">
           {/* <span className="text-sm font-bold text-gray-900">筛选统计</span> */}
           {/* <DrawerClose asChild>
             <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
               <X className="w-5 h-5" />
             </Button>
           </DrawerClose> */}
        </DrawerHeader>

        <div className="p-4 space-y-6 overflow-y-auto">
            {/* Type Selector */}
            <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-500">收支类型</h3>
                <Tabs 
                    value={tempFilter.type} 
                    onValueChange={(v) => setTempFilter(prev => ({ ...prev, type: v as any }))}
                >
                    <TabsList className="grid w-full grid-cols-2 h-10 bg-gray-100 rounded-xl p-1">
                        <TabsTrigger value="expense" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">支出</TabsTrigger>
                        <TabsTrigger value="income" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">收入</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Time Range */}
            <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-500">时间范围</h3>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2">
                    <Button variant="ghost" size="icon" onClick={() => handleMonthChange(-1)}>
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </Button>
                    <span className="font-mono font-medium text-lg text-gray-800">
                        {format(currentDate, 'yyyy年 MM月', { locale: zhCN })}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleMonthChange(1)}>
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </Button>
                </div>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-500">备注搜索</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                        placeholder="输入备注关键词..." 
                        className="pl-9 bg-gray-50 border-0 h-10 rounded-xl"
                        value={tempFilter.keyword || ''}
                        onChange={(e) => setTempFilter(prev => ({ ...prev, keyword: e.target.value }))}
                    />
                </div>
            </div>

            {/* Ledger Selector */}
            <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-500">选择账本</h3>
                <div className="grid grid-cols-2 gap-2">
                    {ledgers.map(ledger => (
                        <div 
                            key={ledger.id}
                            className={cn(
                                "relative p-3 rounded-xl border-2 cursor-pointer transition-all",
                                tempLedgerId === ledger.id 
                                    ? "border-teal-500 bg-teal-50/50" 
                                    : "border-transparent bg-gray-50 hover:bg-gray-100"
                            )}
                            onClick={() => setTempLedgerId(ledger.id)}
                        >
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    ledger.is_default ? "bg-teal-500" : "bg-indigo-500"
                                )} />
                                <span className={cn(
                                    "text-sm font-medium truncate",
                                    tempLedgerId === ledger.id ? "text-teal-900" : "text-gray-700"
                                )}>
                                    {ledger.name}
                                </span>
                            </div>
                            {ledger.is_default && <span className="text-[10px] text-gray-400 ml-4">总账本</span>}
                            
                            {tempLedgerId === ledger.id && (
                                <div className="absolute top-2 right-2 bg-teal-500 rounded-full p-0.5">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Button className="w-full h-12 text-lg font-bold bg-teal-600 hover:bg-teal-700 rounded-xl mt-4" onClick={handleApply}>
                应用筛选
            </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
