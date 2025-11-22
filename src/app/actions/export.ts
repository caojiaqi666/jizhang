'use server'

import { getSession } from "@/utils/auth/session"
import { query } from "@/utils/mysql/client"
import type { RowDataPacket } from 'mysql2/promise'

export async function getAllTransactionsForExport() {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const transactions = await query<RowDataPacket>(
        `SELECT 
            t.date,
            t.amount,
            t.note,
            t.mood,
            c.name as category_name,
            c.type as category_type,
            l.name as ledger_name
         FROM transactions t
         LEFT JOIN categories c ON t.category_id = c.id
         LEFT JOIN ledgers l ON t.ledger_id = l.id
         WHERE t.user_id = ?
         ORDER BY t.date DESC`,
        [session.userId]
    )

    // Convert to CSV friendly format
    return transactions.map((t: any) => ({
        Date: new Date(t.date).toLocaleDateString(),
        Type: Number(t.amount) < 0 ? '支出' : '收入',
        Category: t.category_name || 'Unknown',
        Amount: Math.abs(Number(t.amount)),
        Note: t.note || '',
        Mood: t.mood || '',
        Ledger: t.ledger_name || 'Default'
    }))
}
