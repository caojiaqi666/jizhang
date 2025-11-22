'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAdminByUsername } from '@/utils/mysql/auth'
import { verifyPassword } from '@/utils/auth/password'
import { createAdminSession, getAdminSession, deleteAdminSession } from '@/utils/auth/session'
import { getAllUsers, getUserCount, getUserById, updateUserMembership } from '@/utils/mysql/user'
import { getAllSystemCategories, createCategory, updateCategory, deleteCategory } from '@/utils/mysql/category'

export async function adminLogin(formData: FormData) {
  try {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    // Use environment variables for admin auth
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (username !== adminUsername || password !== adminPassword) {
      redirect('/admin/login?error=' + encodeURIComponent('用户名或密码错误'))
    }

    // Create admin session
    await createAdminSession(1, username)

    revalidatePath('/admin', 'layout')
    redirect('/admin/dashboard')
  } catch (error: any) {
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Admin login error:', error)
    redirect('/admin/login?error=' + encodeURIComponent(error.message || '登录失败'))
  }
}

export async function adminLogout() {
  await deleteAdminSession()
  redirect('/admin/login')
}

export async function getUsers(page: number = 1, search?: string) {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')

  const limit = 20
  const offset = (page - 1) * limit

  const users = await getAllUsers(limit, offset, search)
  const total = await getUserCount(search)

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}

export async function updateUserMembershipAction(
  userId: number,
  isPro: boolean,
  days?: number
) {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')

  let expiresAt: Date | null = null
  
  if (isPro && days) {
    expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)
  }

  await updateUserMembership(userId, isPro, expiresAt)
  
  revalidatePath('/admin/users')
  return { success: true }
}

export async function getSystemCategories() {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')

  return await getAllSystemCategories()
}

export async function createSystemCategory(
  name: string,
  icon: string,
  type: 'income' | 'expense',
  color?: string
) {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')

  await createCategory(name, icon, type, color)
  
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function updateSystemCategory(
  categoryId: number,
  name: string,
  icon: string,
  color?: string
) {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')

  await updateCategory(categoryId, { name, icon, color })
  
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteSystemCategory(categoryId: number) {
  const session = await getAdminSession()
  if (!session) throw new Error('Unauthorized')

  try {
    await deleteCategory(categoryId)
    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

