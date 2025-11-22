'use server'

import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear } from "date-fns"
import { getSession } from "@/utils/auth/session"
import { getTransactions, getTransactionStats, getCategoryStats, getMoodStats, createTransaction as dbCreateTransaction } from "@/utils/mysql/transaction"
import { getDefaultLedger } from "@/utils/mysql/ledger"
import { createCategory, getCategoriesByType } from "@/utils/mysql/category"
import { revalidatePath } from "next/cache"

export interface DashboardData {
  balance: number
  income: number
  expense: number
  transactions: any[]
}

export interface StatsFilter {
    range: 'week' | 'month' | 'year' | 'custom'
    type: 'income' | 'expense' | 'all'
    date: string // ISO string or YYYY-MM format
    keyword?: string
}

export interface CreateTransactionParams {
    amount: number
    type: 'income' | 'expense'
    categoryId: string // This is the icon/identifier from frontend
    ledgerId: number
    date: string
    note?: string
    mood?: string
}

const VALID_MOODS = ['happy', 'neutral', 'sad', 'angry', 'fear', 'grateful']

export async function createTransaction(params: CreateTransactionParams) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    try {
        // 1. Validate and map mood
        let mood = params.mood
        if (mood && !VALID_MOODS.includes(mood)) {
            if (mood === 'anxious') mood = 'fear' 
            else if (mood === 'regret') mood = 'sad'
            else mood = 'neutral' // Fallback
        }

        // 2. Find or create category
        // The frontend sends 'icon' as categoryId. We need to find the real category ID.
        // Try to find existing category by icon and type for this user (or system default)
        
        const categories = await getCategoriesByType(params.type, session.userId)
        let category = categories.find(c => c.icon === params.categoryId || c.name === params.categoryId)
        
        let realCategoryId: number

        if (category) {
            realCategoryId = category.id
        } else {
            // Create new user-specific category
            realCategoryId = await createCategory(
                params.categoryId, // name
                params.categoryId, // icon
                params.type,
                undefined, // color
                session.userId
            )
        }

        // 3. Create transaction
        await dbCreateTransaction(
            session.userId,
            params.ledgerId,
            realCategoryId,
            params.type === 'expense' ? -Math.abs(params.amount) : Math.abs(params.amount),
            new Date(params.date),
            params.note,
            mood
        )

        revalidatePath('/')
        revalidatePath('/stats')
        return { success: true }
    } catch (error: any) {
        console.error("Create transaction error:", error)
        throw new Error(error.message || "创建交易失败")
    }
}

export async function getDashboardData(ledgerId?: number, keyword?: string): Promise<DashboardData> {
  const session = await getSession()
  if (!session) throw new Error("Unauthorized")

  const defaultLedger = await getDefaultLedger(session.userId)
  
  // Logic: 
  // 1. If ledgerId is NOT provided OR matches defaultLedgerId -> Query ALL user transactions (Master View)
  // 2. If ledgerId IS provided and is NOT default -> Query only that ledger's transactions (Subset View)
  
  const isMasterView = !ledgerId || (defaultLedger && ledgerId === defaultLedger.id)

  const now = new Date()
  const start = startOfMonth(now)
  const end = endOfMonth(now)

  // Get transactions
  const transactions = await getTransactions(
    session.userId,
    isMasterView ? undefined : ledgerId,
    start,
    end,
    keyword
  )

  // Get stats
  const stats = await getTransactionStats(
    session.userId,
    isMasterView ? undefined : ledgerId,
    start,
    end
  )

  // Format transactions for the frontend
  const formattedTransactions = transactions.map(t => ({
    id: t.id,
    amount: Number(t.amount),
    date: t.date.toISOString(),
    note: t.note,
    mood: t.mood,
    image_url: t.image_url,
    categories: t.category_name ? {
      name: t.category_name,
      icon: t.category_icon,
      type: t.category_type
    } : null
  }))

  return {
    balance: stats.balance,
    income: stats.income,
    expense: stats.expense,
    transactions: formattedTransactions
  }
}

export async function getStatsData(filter: StatsFilter, ledgerId?: number) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const defaultLedger = await getDefaultLedger(session.userId)
    const isMasterView = !ledgerId || (defaultLedger && ledgerId === defaultLedger.id)

    let start: Date, end: Date
    const refDate = filter.date ? new Date(filter.date) : new Date()

    if (filter.range === 'week') {
        start = startOfWeek(refDate, { weekStartsOn: 1 })
        end = endOfWeek(refDate, { weekStartsOn: 1 })
    } else if (filter.range === 'year') {
        start = startOfYear(refDate)
        end = endOfYear(refDate)
    } else {
        // Default to month (either 'month' or 'custom' treated as monthly view for now)
        start = startOfMonth(refDate)
        end = endOfMonth(refDate)
    }

    // Determine which type to query
    const targetType = filter.type === 'all' ? 'expense' : filter.type

    // Get category stats
    const categoryStats = await getCategoryStats(
        session.userId,
        targetType,
        isMasterView ? undefined : ledgerId,
        start,
        end
    )

    // Get mood stats
    const moodStats = await getMoodStats(
        session.userId,
        targetType,
        isMasterView ? undefined : ledgerId,
        start,
        end
    )

    // Calculate total
    const totalAmount = categoryStats.reduce((sum, cat) => sum + cat.value, 0)

    return {
        totalAmount,
        categoryStats,
        moodStats,
        filterType: filter.type
    }
}
