import { queryOne, execute } from './client'
import type { RowDataPacket } from 'mysql2/promise'

export interface Admin extends RowDataPacket {
  id: number
  username: string
  password_hash: string
  created_at: Date
}

export async function getAdminByUsername(username: string): Promise<Admin | null> {
  return queryOne<Admin>(
    'SELECT * FROM admins WHERE username = ?',
    [username]
  )
}

export async function createAdmin(
  username: string,
  passwordHash: string
): Promise<number> {
  const result = await execute(
    'INSERT INTO admins (username, password_hash, created_at) VALUES (?, ?, ?)',
    [username, passwordHash, new Date()]
  )
  return result.insertId
}

