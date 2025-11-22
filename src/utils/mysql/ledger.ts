import { query, queryOne, execute } from './client'
import type { RowDataPacket } from 'mysql2/promise'

export interface Ledger extends RowDataPacket {
  id: number
  user_id: number
  name: string
  is_default: boolean
  created_at: Date
  updated_at: Date
}

export async function getLedgersByUserId(userId: number): Promise<Ledger[]> {
  return query<Ledger>(
    'SELECT * FROM ledgers WHERE user_id = ? ORDER BY is_default DESC, created_at ASC',
    [userId]
  )
}

export async function getLedgerById(ledgerId: number): Promise<Ledger | null> {
  return queryOne<Ledger>(
    'SELECT * FROM ledgers WHERE id = ?',
    [ledgerId]
  )
}

export async function getDefaultLedger(userId: number): Promise<Ledger | null> {
  return queryOne<Ledger>(
    'SELECT * FROM ledgers WHERE user_id = ? AND is_default = TRUE LIMIT 1',
    [userId]
  )
}

export async function createLedger(
  userId: number,
  name: string,
  isDefault: boolean = false
): Promise<number> {
  const now = new Date()
  
  // If this is set as default, unset other defaults
  if (isDefault) {
    await execute(
      'UPDATE ledgers SET is_default = FALSE WHERE user_id = ?',
      [userId]
    )
  }
  
  const result = await execute(
    'INSERT INTO ledgers (user_id, name, is_default, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
    [userId, name, isDefault, now, now]
  )
  
  return result.insertId
}

export async function updateLedger(
  ledgerId: number,
  name: string
): Promise<void> {
  await execute(
    'UPDATE ledgers SET name = ?, updated_at = ? WHERE id = ?',
    [name, new Date(), ledgerId]
  )
}

export async function deleteLedger(ledgerId: number): Promise<void> {
  // Don't allow deleting default ledger
  const ledger = await getLedgerById(ledgerId)
  if (ledger?.is_default) {
    throw new Error('无法删除默认账本')
  }
  
  // Check if has transactions
  const transactionCheck = await queryOne<RowDataPacket>(
    'SELECT COUNT(*) as count FROM transactions WHERE ledger_id = ?',
    [ledgerId]
  )
  
  if (transactionCheck && transactionCheck.count > 0) {
    throw new Error('该账本中还有记录，无法删除')
  }
  
  await execute('DELETE FROM ledgers WHERE id = ?', [ledgerId])
}

export async function ensureDefaultLedger(userId: number): Promise<Ledger> {
  let ledger = await getDefaultLedger(userId)
  
  if (!ledger) {
    const ledgerId = await createLedger(userId, '默认账本', true)
    ledger = await getLedgerById(ledgerId)
    if (!ledger) {
      throw new Error('Failed to create default ledger')
    }
  }
  
  return ledger
}

