'use server'

import { createClient } from "@/utils/supabase/server"
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear, format, parse } from "date-fns"

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

async function getDefaultLedgerId(supabase: any, userId: string): Promise<string | null> {
    const { data } = await supabase
        .from('ledgers')
        .select('id')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single()
    return data?.id || null
}

export async function getDashboardData(ledgerId?: string, keyword?: string): Promise<DashboardData> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const defaultLedgerId = await getDefaultLedgerId(supabase, user.id)
  
  // Logic: 
  // 1. If ledgerId is NOT provided OR matches defaultLedgerId -> Query ALL user transactions (Master View)
  // 2. If ledgerId IS provided and is NOT default -> Query only that ledger's transactions (Subset View)
  
  const isMasterView = !ledgerId || (defaultLedgerId && ledgerId === defaultLedgerId)

  const now = new Date()
  const start = startOfMonth(now).toISOString()
  const end = endOfMonth(now).toISOString()

  let query = supabase
    .from('transactions')
    .select(`
      *,
      categories (
        name,
        icon,
        color:type
      )
    `)
    .eq('user_id', user.id)
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: false })
  
  // Only apply filter if NOT in master view
  if (!isMasterView && ledgerId) {
      query = query.eq('ledger_id', ledgerId)
  }

  if (keyword) {
      query = query.ilike('note', `%${keyword}%`)
  }

  const { data: transactions, error } = await query

  if (error) throw error

  let income = 0
  let expense = 0

  transactions?.forEach(t => {
    const amt = Number(t.amount)
    if (amt > 0) income += amt
    else expense += Math.abs(amt)
  })

  const recentTransactions = transactions || []

  return {
    balance: income - expense,
    income,
    expense,
    transactions: recentTransactions
  }
}

export async function getStatsData(filter: StatsFilter, ledgerId?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const defaultLedgerId = await getDefaultLedgerId(supabase, user.id)
    const isMasterView = !ledgerId || (defaultLedgerId && ledgerId === defaultLedgerId)

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

    let query = supabase
        .from('transactions')
        .select(`
            *,
            categories (name, icon)
        `)
        .eq('user_id', user.id)
        .gte('date', start.toISOString())
        .lte('date', end.toISOString())

    // Filter by ledger if provided AND not master view
    if (!isMasterView && ledgerId) {
        query = query.eq('ledger_id', ledgerId)
    }

    if (filter.keyword) {
        query = query.ilike('note', `%${filter.keyword}%`)
    }

    const { data: transactions } = await query

    // Process data based on type filter
    const categoryMap = new Map<string, number>()
    const moodMap = new Map<string, number>()
    let totalAmount = 0

    transactions?.forEach(t => {
        const amt = Number(t.amount)
        const isIncome = amt > 0
        const absAmt = Math.abs(amt)

        // Filter logic:
        const targetType = filter.type === 'all' ? 'expense' : filter.type
        const matchesType = (targetType === 'income' && isIncome) || (targetType === 'expense' && !isIncome)

        if (matchesType) {
            totalAmount += absAmt
            
            // Category Stats
            const catName = t.categories?.name || '未知'
            categoryMap.set(catName, (categoryMap.get(catName) || 0) + absAmt)

            // Mood Stats
            const mood = t.mood || 'neutral'
            moodMap.set(mood, (moodMap.get(mood) || 0) + absAmt)
        }
    })

    const categoryStats = Array.from(categoryMap.entries()).map(([name, value]) => ({
        name, value
    })).sort((a, b) => b.value - a.value)

    const moodStats = Array.from(moodMap.entries()).map(([id, amount]) => ({
        id, amount
    })).sort((a, b) => b.amount - a.amount)

    return {
        totalAmount,
        categoryStats,
        moodStats,
        filterType: filter.type
    }
}
