"use client"

import * as React from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronRight, Check } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

import { CategoryGrid, CategoryType } from "./category-grid"
import { MoodSelector, MOODS } from "./mood-selector"
import { createTransaction } from "@/app/actions/finance"
import { useLedger } from "@/components/ledger-provider"
import { useTheme, THEME_VARIANTS } from "@/components/theme-provider"

interface RecordDrawerProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function RecordDrawer({ children, open, onOpenChange }: RecordDrawerProps) {
  const router = useRouter()
  const { primaryColor } = useTheme()
  const theme = THEME_VARIANTS[primaryColor]
  const { currentLedger, ledgers } = useLedger()
  
  const [amount, setAmount] = React.useState("0")
  const [date, setDate] = React.useState<Date>(new Date())
  const [type, setType] = React.useState<CategoryType>("expense")
  const [categoryId, setCategoryId] = React.useState<string | null>(null)
  const [moodId, setMoodId] = React.useState<string | null>("neutral")
  const [note, setNote] = React.useState("")
  const [selectedLedgerId, setSelectedLedgerId] = React.useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showLedgerSelector, setShowLedgerSelector] = React.useState(false)

  // Initialize selectedLedgerId when currentLedger changes or drawer opens
  React.useEffect(() => {
      if (open && currentLedger) {
          setSelectedLedgerId(currentLedger.id)
      }
  }, [open, currentLedger])

  const activeLedgerId = selectedLedgerId || currentLedger?.id
  const activeLedgerName = ledgers.find(l => l.id === activeLedgerId)?.name || currentLedger?.name

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty or valid numbers
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value || "0")
    }
  }

  const handleSubmit = async () => {
    if (amount === "0" || parseFloat(amount) === 0) {
      toast.error("请输入有效金额")
      return
    }
    if (!categoryId) {
      toast.error("请选择分类")
      return
    }
    if (!activeLedgerId) {
        toast.error("未找到账本，请先创建或选择账本")
        return
    }

    setIsSubmitting(true)
    try {
      await createTransaction({
        amount: parseFloat(amount),
        type: type,
        categoryId: categoryId,
        ledgerId: parseInt(activeLedgerId),
        date: date.toISOString(),
        note: note,
        mood: moodId || undefined
      })

      const moodMsg = MOODS.find(m => m.id === moodId)?.message
      toast.success("记账成功！", {
        description: moodMsg || "继续保持！"
      })

      // Reset form
      setAmount("0")
      setNote("")
      
      // Refresh data
      router.refresh()
      
      // Emit custom event to force re-fetch in Dashboard
      window.dispatchEvent(new Event('transaction-updated'))

      if (onOpenChange) onOpenChange(false)

    } catch (error: any) {
      console.error(error)
      toast.error("记账失败: " + (error.message || "未知错误"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const amountColor = type === "expense" ? "text-gray-900" : theme.text

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[92vh] max-h-[850px] flex flex-col rounded-t-[40px] bg-gray-50">
        <DrawerHeader className="px-6 py-4 flex items-center justify-between shrink-0 relative z-10">
           <Tabs value={type} onValueChange={(v) => setType(v as CategoryType)} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2 h-10 bg-white rounded-full p-1 shadow-sm border border-gray-100">
              <TabsTrigger value="expense" className="rounded-full text-xs font-bold data-[state=active]:bg-expense data-[state=active]:text-white data-[state=active]:shadow-md transition-all">支出</TabsTrigger>
              <TabsTrigger value="income" className="rounded-full text-xs font-bold data-[state=active]:bg-income data-[state=active]:text-white data-[state=active]:shadow-md transition-all">收入</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Close Button */}
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto absolute left-1/2 top-3 -translate-x-1/2 opacity-50" />
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4">
            {/* Date and Ledger Selection */}
            <div className="px-6 pt-2 flex items-center justify-between">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 text-xs font-medium rounded-xl border-gray-200 bg-white text-gray-600 shadow-sm hover:shadow transition-shadow">
                            <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                            {date ? format(date, "MM月dd日", { locale: zhCN }) : "今天"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => d && setDate(d)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <Popover open={showLedgerSelector} onOpenChange={setShowLedgerSelector}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 text-xs font-medium rounded-xl border-gray-200 bg-white text-gray-600 shadow-sm hover:shadow transition-shadow">
                            记入：{activeLedgerName}
                            <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-2" align="end">
                        <div className="space-y-1">
                            <div className="text-xs font-medium text-gray-500 px-2 py-1">选择账本</div>
                            {ledgers.map(ledger => (
                                <div 
                                    key={ledger.id}
                                    className={cn(
                                        "flex items-center justify-between px-2 py-1.5 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition-colors",
                                        activeLedgerId === ledger.id && cn("bg-opacity-10", theme.lightBg, theme.text)
                                    )}
                                    onClick={() => {
                                        setSelectedLedgerId(ledger.id)
                                        setShowLedgerSelector(false)
                                    }}
                                >
                                    <span>{ledger.name}</span>
                                    {activeLedgerId === ledger.id && <Check className="w-3 h-3" />}
                                </div>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Amount Input */}
            <div className="px-6">
                <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
                    <div className="flex items-center justify-center gap-2">
                        <span className={cn(
                            "text-3xl font-bold font-nunito transition-colors",
                            type === "expense" ? "text-expense" : "text-income"
                        )}>
                            {type === "expense" ? "-" : "+"}
                        </span>
                        <Input
                            type="number"
                            inputMode="decimal"
                            value={amount}
                            onChange={handleAmountChange}
                            onFocus={(e) => {
                                if (e.target.value === "0") {
                                    setAmount("")
                                }
                                e.target.select()
                            }}
                            onBlur={(e) => {
                                if (e.target.value === "") {
                                    setAmount("0")
                                }
                            }}
                            className={cn(
                                "text-5xl font-extrabold font-nunito text-center border-0 bg-transparent p-0 h-auto focus-visible:ring-0 transition-colors",
                                type === "expense" ? "text-expense" : "text-income"
                            )}
                            placeholder="0"
                        />
                    </div>
                    <div className="text-center text-xs text-gray-400 mt-3">
                        输入金额
                    </div>
                </div>
            </div>

            {/* Category Grid */}
            <div>
                <CategoryGrid selectedId={categoryId} onSelect={setCategoryId} type={type} />
            </div>

            {/* Mood & Note */}
            <div className="px-6 space-y-4">
                <div>
                    <label className="text-xs text-gray-500 font-semibold mb-3 block ml-1">此刻心情</label>
                    <MoodSelector selectedId={moodId} onSelect={setMoodId} />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                    <Input 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="写点备注吧..." 
                        className="border-0 bg-transparent p-0 h-9 focus-visible:ring-0 placeholder:text-gray-400 text-gray-700"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="px-6 pb-6 pt-4">
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !categoryId || amount === "0"}
                    className={cn(
                        "w-full h-14 rounded-2xl text-lg font-bold shadow-lg transition-all",
                        type === 'expense' 
                            ? 'bg-expense hover:bg-expense/90 active:scale-[0.98]' 
                            : 'bg-income hover:bg-income/90 active:scale-[0.98]',
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                >
                    {isSubmitting ? "记账中..." : "确认记账"}
                </Button>
            </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
