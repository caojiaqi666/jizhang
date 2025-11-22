import { query, queryOne, execute } from './client'
import type { RowDataPacket } from 'mysql2/promise'

export interface User extends RowDataPacket {
  id: number
  phone: string
  password_hash: string
  email: string | null
  display_name: string | null
  avatar_url: string | null
  membership_tier: 'free' | 'pro'
  is_pro: boolean
  pro_expires_at: Date | null
  trial_started_at: Date | null
  trial_ends_at: Date | null
  monthly_savings_goal: number | null
  monthly_savings_enabled: boolean
  created_at: Date
  updated_at: Date
}

export async function getUserById(userId: number): Promise<User | null> {
  return queryOne<User>(
    'SELECT * FROM users WHERE id = ?',
    [userId]
  )
}

export async function getUserByPhone(phone: string): Promise<User | null> {
  return queryOne<User>(
    'SELECT * FROM users WHERE phone = ?',
    [phone]
  )
}

export async function createUser(
  phone: string,
  passwordHash: string,
  displayName?: string
): Promise<number> {
  const now = new Date()
  const trialEndsAt = new Date()
  trialEndsAt.setDate(trialEndsAt.getDate() + 7) // 7 days trial
  
  const result = await execute(
    `INSERT INTO users (
      phone, password_hash, display_name, 
      membership_tier, is_pro, 
      trial_started_at, trial_ends_at, pro_expires_at,
      created_at, updated_at
    ) VALUES (?, ?, ?, 'pro', TRUE, ?, ?, ?, ?, ?)`,
    [
      phone,
      passwordHash,
      displayName || `用户${phone.slice(-4)}`,
      now,
      trialEndsAt,
      trialEndsAt,
      now,
      now
    ]
  )
  
  return result.insertId
}

export async function updateUserProfile(
  userId: number,
  updates: {
    display_name?: string
    avatar_url?: string
    monthly_savings_goal?: number
    monthly_savings_enabled?: boolean
  }
): Promise<void> {
  const fields: string[] = []
  const values: any[] = []
  
  if (updates.display_name !== undefined) {
    fields.push('display_name = ?')
    values.push(updates.display_name)
  }
  if (updates.avatar_url !== undefined) {
    fields.push('avatar_url = ?')
    values.push(updates.avatar_url)
  }
  if (updates.monthly_savings_goal !== undefined) {
    fields.push('monthly_savings_goal = ?')
    values.push(updates.monthly_savings_goal)
  }
  if (updates.monthly_savings_enabled !== undefined) {
    fields.push('monthly_savings_enabled = ?')
    values.push(updates.monthly_savings_enabled)
  }
  
  if (fields.length === 0) return
  
  fields.push('updated_at = ?')
  values.push(new Date())
  values.push(userId)
  
  await execute(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  )
}

export async function updateUserMembership(
  userId: number,
  isPro: boolean,
  expiresAt: Date | null = null
): Promise<void> {
  await execute(
    `UPDATE users SET 
      is_pro = ?,
      membership_tier = ?,
      pro_expires_at = ?,
      updated_at = ?
    WHERE id = ?`,
    [
      isPro,
      isPro ? 'pro' : 'free',
      expiresAt,
      new Date(),
      userId
    ]
  )
}

export async function checkAndUpdateExpiredMemberships(): Promise<void> {
  const now = new Date()
  await execute(
    `UPDATE users SET 
      is_pro = FALSE,
      membership_tier = 'free',
      pro_expires_at = NULL,
      trial_started_at = NULL,
      trial_ends_at = NULL,
      updated_at = ?
    WHERE pro_expires_at IS NOT NULL 
      AND pro_expires_at <= ? 
      AND is_pro = TRUE`,
    [now, now]
  )
}

export async function getAllUsers(
  limit: number = 50,
  offset: number = 0,
  search?: string
): Promise<User[]> {
  let sql = 'SELECT * FROM users'
  const params: any[] = []
  
  if (search) {
    sql += ' WHERE phone LIKE ? OR display_name LIKE ?'
    params.push(`%${search}%`, `%${search}%`)
  }
  
  // Use explicit casting or interpolation for LIMIT/OFFSET to avoid mysql2 prepared statement issues with numbers
  // However, string interpolation is safer against injection if we parse as int first
  // mysql2 execute() treats numbers as strings in prepared statements sometimes causing 1210 error
  // But for LIMIT/OFFSET it strictly expects integers. 
  // The error 'Incorrect arguments to mysqld_stmt_execute' (1210) with LIMIT ? usually means
  // the driver is sending them as strings '10' instead of 10, or similar type mismatch.
  // Actually, for LIMIT/OFFSET in prepared statements, mysql2 requires them to be numbers, BUT
  // sometimes the underlying protocol fails if they are sent as strings.
  // Let's try using direct interpolation for LIMIT/OFFSET as they are safe integers here.
  
  const safeLimit = Math.max(1, Math.floor(limit));
  const safeOffset = Math.max(0, Math.floor(offset));
  
  sql += ` ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`
  
  return query<User>(sql, params)
}

export async function getUserCount(search?: string): Promise<number> {
  let sql = 'SELECT COUNT(*) as count FROM users'
  const params: any[] = []
  
  if (search) {
    sql += ' WHERE phone LIKE ? OR display_name LIKE ?'
    params.push(`%${search}%`, `%${search}%`)
  }
  
  const result = await queryOne<RowDataPacket>(sql, params)
  return result?.count || 0
}

export async function updateUserPassword(userId: number, passwordHash: string): Promise<void> {
  await execute(
    'UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?',
    [passwordHash, new Date(), userId]
  )
}

