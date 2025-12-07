import { query, queryOne, execute } from './client'
import type { RowDataPacket } from 'mysql2/promise'

export interface Category extends RowDataPacket {
  id: number
  user_id: number | null
  name: string
  icon: string
  color: string | null
  type: 'income' | 'expense'
  is_default: boolean
  created_at: Date
}

export async function getCategoriesByType(
  type: 'income' | 'expense',
  userId?: number
): Promise<Category[]> {
  // Get system categories (user_id IS NULL) and user's custom categories
  if (userId) {
    return query<Category>(
      `SELECT * FROM categories 
       WHERE type = ? AND (user_id IS NULL OR user_id = ?)
       ORDER BY user_id IS NULL DESC, created_at ASC`,
      [type, userId]
    )
  } else {
    // Only system categories
    return query<Category>(
      'SELECT * FROM categories WHERE type = ? AND user_id IS NULL ORDER BY created_at ASC',
      [type]
    )
  }
}

export async function getCategoryById(categoryId: number): Promise<Category | null> {
  return queryOne<Category>(
    'SELECT * FROM categories WHERE id = ?',
    [categoryId]
  )
}

export async function createCategory(
  name: string,
  icon: string,
  type: 'income' | 'expense',
  color?: string,
  userId?: number
): Promise<number> {
  const result = await execute(
    'INSERT INTO categories (name, icon, type, color, user_id, is_default) VALUES (?, ?, ?, ?, ?, ?)',
    [name, icon, type, color || null, userId || null, userId ? false : true]
  )
  return result.insertId
}

export async function updateCategory(
  categoryId: number,
  updates: {
    name?: string
    icon?: string
    color?: string
  }
): Promise<void> {
  const fields: string[] = []
  const values: any[] = []
  
  if (updates.name !== undefined) {
    fields.push('name = ?')
    values.push(updates.name)
  }
  if (updates.icon !== undefined) {
    fields.push('icon = ?')
    values.push(updates.icon)
  }
  if (updates.color !== undefined) {
    fields.push('color = ?')
    values.push(updates.color)
  }
  
  if (fields.length === 0) return
  
  values.push(categoryId)
  
  await execute(
    `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
    values
  )
}

export async function deleteCategory(categoryId: number): Promise<void> {
  // Check if category is being used
  const usageCheck = await queryOne<RowDataPacket>(
    'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?',
    [categoryId]
  )
  
  if (usageCheck && usageCheck.count > 0) {
    throw new Error('该分类正在使用中，无法删除')
  }
  
  await execute('DELETE FROM categories WHERE id = ?', [categoryId])
}

export async function getAllSystemCategories(): Promise<Category[]> {
  return query<Category>(
    'SELECT * FROM categories WHERE user_id IS NULL ORDER BY type, created_at ASC'
  )
}

