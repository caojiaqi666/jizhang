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

import { Keypad } from "./keypad"
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

  const handleKeyPress = (key: string) => {
    if (key === "." && amount.includes(".")) return
    if (key === "." && amount === "0") {
      setAmount("0.")
      return
    }
    if (amount === "0" && key !== ".") {
      setAmount(key)
    } else {
      if (amount.replace(".", "").length >= 9) return // Limit length
      setAmount(prev => prev + key)
    }
  }

  const handleDelete = () => {
    if (amount.length === 1) {
      setAmount("0")
    } else {
      setAmount(prev => prev.slice(0, -1))
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
        
        <div className="flex-1 overflow-y-auto">
            {/* Amount Display */}
            <div className="px-6 py-8 flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-4">
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 text-xs font-medium rounded-full border-gray-200 bg-white text-gray-500 shadow-sm">
                                <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                                {date ? format(date, "MM月dd日", { locale: zhCN }) : "今天"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => d && setDate(d)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className={cn(
                    "text-6xl font-extrabold tracking-tighter font-nunito transition-colors duration-300",
                    type === "expense" ? "text-expense" : "text-income"
                )}>
                    {type === "expense" ? "-" : "+"}{amount}
                </div>
                
                <Popover open={showLedgerSelector} onOpenChange={setShowLedgerSelector}>
                    <PopoverTrigger asChild>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3 cursor-pointer hover:text-gray-600 transition-colors bg-white px-3 py-1 rounded-full shadow-sm">
                            记入：{activeLedgerName}
                            <ChevronRight className="w-3 h-3" />
                        </div>
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

            {/* Category Grid */}
            <div className="mb-4">
                <CategoryGrid selectedId={categoryId} onSelect={setCategoryId} type={type} />
            </div>

            {/* Mood & Note */}
            <div className="px-6 mb-6 space-y-4">
                <div>
                    <label className="text-xs text-gray-400 font-bold mb-3 block ml-1 tracking-wide uppercase">此刻心情</label>
                    <MoodSelector selectedId={moodId} onSelect={setMoodId} />
                </div>
                <div className="bg-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm border border-gray-100">
                    <Input 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="写点备注..." 
                        className="border-0 bg-transparent p-0 h-10 focus-visible:ring-0 placeholder:text-gray-400 text-gray-700"
                    />
                </div>
            </div>
        </div>

        {/* Keypad Area - Fixed at bottom */}
        <div className="mt-auto shrink-0 relative z-20">
            <Keypad 
                onKeyPress={handleKeyPress} 
                onDelete={handleDelete} 
                onSubmit={handleSubmit} 
                submitColorClass={type === 'expense' ? 'bg-expense hover:bg-expense/90' : 'bg-income hover:bg-income/90'}
            />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
