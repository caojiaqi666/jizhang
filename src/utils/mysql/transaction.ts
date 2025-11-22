import { query, queryOne, execute } from './client'
import type { RowDataPacket } from 'mysql2/promise'

export interface Transaction extends RowDataPacket {
  id: number
  user_id: number
  ledger_id: number
  category_id: number | null
  amount: number
  date: Date
  note: string | null
  mood: 'happy' | 'neutral' | 'sad' | 'angry' | 'fear' | 'grateful' | null
  image_url: string | null
  created_at: Date
}

export interface TransactionWithCategory extends Transaction {
  category_name?: string
  category_icon?: string
  category_type?: string
}

export async function getTransactions(
  userId: number,
  ledgerId?: number,
  startDate?: Date,
  endDate?: Date,
  keyword?: string
): Promise<TransactionWithCategory[]> {
  let sql = `
    SELECT t.*, c.name as category_name, c.icon as category_icon, c.type as category_type
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
  `
  const params: any[] = [userId]
  
  if (ledgerId) {
    sql += ' AND t.ledger_id = ?'
    params.push(ledgerId)
  }
  
  if (startDate) {
    sql += ' AND t.date >= ?'
    params.push(startDate)
  }
  
  if (endDate) {
    sql += ' AND t.date <= ?'
    params.push(endDate)
  }
  
  if (keyword) {
    sql += ' AND t.note LIKE ?'
    params.push(`%${keyword}%`)
  }
  
  sql += ' ORDER BY t.date DESC, t.created_at DESC'
  
  return query<TransactionWithCategory>(sql, params)
}

export async function getTransactionById(
  transactionId: number
): Promise<Transaction | null> {
  return queryOne<Transaction>(
    'SELECT * FROM transactions WHERE id = ?',
    [transactionId]
  )
}

export async function createTransaction(
  userId: number,
  ledgerId: number,
  categoryId: number,
  amount: number,
  date: Date,
  note?: string,
  mood?: string,
  imageUrl?: string
): Promise<number> {
  const result = await execute(
    `INSERT INTO transactions (
      user_id, ledger_id, category_id, amount, date, note, mood, image_url, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId, 
      ledgerId, 
      categoryId, 
      amount, 
      date, 
      note ?? null, 
      mood ?? null, 
      imageUrl ?? null, 
      new Date()
    ]
  )
  
  return result.insertId
}

export async function updateTransaction(
  transactionId: number,
  updates: {
    category_id?: number
    amount?: number
    date?: Date
    note?: string
    mood?: string
    image_url?: string
  }
): Promise<void> {
  const fields: string[] = []
  const values: any[] = []
  
  if (updates.category_id !== undefined) {
    fields.push('category_id = ?')
    values.push(updates.category_id)
  }
  if (updates.amount !== undefined) {
    fields.push('amount = ?')
    values.push(updates.amount)
  }
  if (updates.date !== undefined) {
    fields.push('date = ?')
    values.push(updates.date)
  }
  if (updates.note !== undefined) {
    fields.push('note = ?')
    values.push(updates.note)
  }
  if (updates.mood !== undefined) {
    fields.push('mood = ?')
    values.push(updates.mood)
  }
  if (updates.image_url !== undefined) {
    fields.push('image_url = ?')
    values.push(updates.image_url)
  }
  
  if (fields.length === 0) return
  
  values.push(transactionId)
  
  await execute(
    `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`,
    values
  )
}

export async function deleteTransaction(transactionId: number): Promise<void> {
  await execute('DELETE FROM transactions WHERE id = ?', [transactionId])
}

export interface TransactionStats {
  income: number
  expense: number
  balance: number
}

export async function getTransactionStats(
  userId: number,
  ledgerId?: number,
  startDate?: Date,
  endDate?: Date
): Promise<TransactionStats> {
  let sql = `
    SELECT 
      SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as expense
    FROM transactions
    WHERE user_id = ?
  `
  const params: any[] = [userId]
  
  if (ledgerId) {
    sql += ' AND ledger_id = ?'
    params.push(ledgerId)
  }
  
  if (startDate) {
    sql += ' AND date >= ?'
    params.push(startDate)
  }
  
  if (endDate) {
    sql += ' AND date <= ?'
    params.push(endDate)
  }
  
  const result = await queryOne<RowDataPacket>(sql, params)
  
  const income = Number(result?.income || 0)
  const expense = Number(result?.expense || 0)
  
  return {
    income,
    expense,
    balance: income - expense
  }
}

export async function getCategoryStats(
  userId: number,
  type: 'income' | 'expense',
  ledgerId?: number,
  startDate?: Date,
  endDate?: Date
): Promise<Array<{ name: string; value: number }>> {
  const amountCondition = type === 'income' ? 'amount > 0' : 'amount < 0'
  
  let sql = `
    SELECT c.name, SUM(ABS(t.amount)) as value
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ? AND ${amountCondition}
  `
  const params: any[] = [userId]
  
  if (ledgerId) {
    sql += ' AND t.ledger_id = ?'
    params.push(ledgerId)
  }
  
  if (startDate) {
    sql += ' AND t.date >= ?'
    params.push(startDate)
  }
  
  if (endDate) {
    sql += ' AND t.date <= ?'
    params.push(endDate)
  }
  
  sql += ' GROUP BY c.id, c.name ORDER BY value DESC'
  
  const results = await query<RowDataPacket>(sql, params)
  
  return results.map(r => ({
    name: r.name || '未知',
    value: Number(r.value)
  }))
}

export async function getMoodStats(
  userId: number,
  type: 'income' | 'expense',
  ledgerId?: number,
  startDate?: Date,
  endDate?: Date
): Promise<Array<{ id: string; amount: number }>> {
  const amountCondition = type === 'income' ? 'amount > 0' : 'amount < 0'
  
  let sql = `
    SELECT mood as id, SUM(ABS(amount)) as amount
    FROM transactions
    WHERE user_id = ? AND ${amountCondition} AND mood IS NOT NULL
  `
  const params: any[] = [userId]
  
  if (ledgerId) {
    sql += ' AND ledger_id = ?'
    params.push(ledgerId)
  }
  
  if (startDate) {
    sql += ' AND date >= ?'
    params.push(startDate)
  }
  
  if (endDate) {
    sql += ' AND date <= ?'
    params.push(endDate)
  }
  
  sql += ' GROUP BY mood ORDER BY amount DESC'
  
  const results = await query<RowDataPacket>(sql, params)
  
  return results.map(r => ({
    id: r.id,
    amount: Number(r.amount)
  }))
}

