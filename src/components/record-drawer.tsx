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
import { createClient } from "@/utils/supabase/client"
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
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error("请先登录")
        return
      }

      // 1. Try to find existing category by icon (which acts as our static ID for now)
      const { data: existingCategory, error: findError } = await supabase
        .from('categories')
        .select('id')
        .eq('icon', categoryId)
        .eq('type', type)
        .or(`user_id.eq.${user.id},user_id.is.null`) // Find system default or user's own
        .limit(1)
        .single()

      let realCategoryId = existingCategory?.id

      // 2. If not found, create it
      if (!realCategoryId) {
        // Find the name from our static list
        const categoryName = categoryId // In a real app, map ID to Name
        
        const { data: newCategory, error: createError } = await supabase
            .from('categories')
            .insert({
                name: categoryName, // Use the ID as name for simplicity in this demo
                icon: categoryId,
                type: type,
                user_id: user.id, // Create as user-specific category
                is_default: false
            })
            .select('id')
            .single()
            
        if (createError) {
            console.error("Failed to create category:", createError)
            throw new Error("分类创建失败")
        }
        realCategoryId = newCategory.id
      }

      // 3. Insert Transaction with ledger_id
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        amount: type === "expense" ? -parseFloat(amount) : parseFloat(amount),
        category_id: realCategoryId, 
        ledger_id: activeLedgerId, // Ensure correct ledger
        date: date.toISOString(),
        note: note,
        mood: moodId,
      })

      if (error) {
          console.error("Transaction insert failed:", error)
          throw error
      }

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
      toast.error("记账失败: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const amountColor = type === "expense" ? "text-gray-900" : theme.text

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[90vh] max-h-[800px] flex flex-col rounded-t-[32px]">
        <DrawerHeader className="px-4 py-2 border-b flex items-center justify-between shrink-0">
           <Tabs value={type} onValueChange={(v) => setType(v as CategoryType)} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2 h-8 bg-gray-100 rounded-full p-1">
              <TabsTrigger value="expense" className="rounded-full text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">支出</TabsTrigger>
              <TabsTrigger value="income" className="rounded-full text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">收入</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="w-8" /> {/* Spacer */}
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto bg-white">
            {/* Amount Display */}
            <div className="px-6 py-6 flex flex-col items-end justify-center">
                <div className="flex items-center gap-2 mb-2">
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 text-xs font-normal rounded-full border-gray-200 bg-gray-50 text-gray-500">
                                <CalendarIcon className="mr-1 h-3 w-3" />
                                {date ? format(date, "MM月dd日", { locale: zhCN }) : "今天"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
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
                    "text-5xl font-bold tracking-tighter font-mono",
                    amountColor
                )}>
                    {type === "expense" ? "-" : "+"}{amount}
                </div>
                
                <Popover open={showLedgerSelector} onOpenChange={setShowLedgerSelector}>
                    <PopoverTrigger asChild>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 cursor-pointer hover:text-gray-600 transition-colors">
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
            <div className="px-4 mb-4 space-y-3">
                <div>
                    <label className="text-xs text-gray-400 font-medium mb-2 block ml-1">此刻心情</label>
                    <MoodSelector selectedId={moodId} onSelect={setMoodId} />
                </div>
                <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Input 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="写点备注..." 
                        className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 placeholder:text-gray-400"
                    />
                </div>
            </div>
        </div>

        {/* Keypad Area - Fixed at bottom */}
        <div className="mt-auto shrink-0">
            <Keypad 
                onKeyPress={handleKeyPress} 
                onDelete={handleDelete} 
                onSubmit={handleSubmit} 
                submitColorClass={theme.bg}
            />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
