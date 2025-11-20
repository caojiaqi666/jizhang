'use server'

import { createClient } from "@/utils/supabase/server"

export async function getAllTransactionsForExport() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase
        .from('transactions')
        .select(`
            date,
            amount,
            note,
            mood,
            categories (name, type),
            ledgers (name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })

    if (error) throw error

    // Convert to CSV friendly format
    return data.map((t: any) => ({
        Date: new Date(t.date).toLocaleDateString(),
        Type: t.amount < 0 ? '支出' : '收入',
        Category: t.categories?.name || 'Unknown',
        Amount: Math.abs(t.amount),
        Note: t.note || '',
        Mood: t.mood || '',
        Ledger: t.ledgers?.name || 'Default'
    }))
}

