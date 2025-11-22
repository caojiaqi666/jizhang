'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getUserByPhone, createUser } from '@/utils/mysql/user'
import { hashPassword, verifyPassword } from '@/utils/auth/password'
import { createSession, deleteSession } from '@/utils/auth/session'
import { ensureDefaultLedger } from '@/utils/mysql/ledger'

export async function logout() {
  await deleteSession()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function checkUserExists(phone: string) {
  const user = await getUserByPhone(phone)
  return !!user
}

export async function login(formData: FormData) {
  try {
    const phone = formData.get('phone') as string
    const password = formData.get('password') as string

    if (!phone || !password) {
      redirect('/login?error=' + encodeURIComponent('请输入手机号和密码'))
    }

    const user = await getUserByPhone(phone)

    if (!user) {
      redirect('/login?error=' + encodeURIComponent('手机号或密码错误'))
    }

    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      redirect('/login?error=' + encodeURIComponent('手机号或密码错误'))
    }

    await createSession(user.id, user.phone)

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error: any) {
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Login error:', error)
    redirect('/login?error=' + encodeURIComponent(error.message || '登录失败'))
  }
}

export async function signup(formData: FormData) {
  try {
    const phone = formData.get('phone') as string
    const password = formData.get('password') as string

    if (!phone || !password) {
      redirect('/login?error=' + encodeURIComponent('请输入手机号和密码'))
    }

    // Validate phone format (simple validation)
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      redirect('/login?error=' + encodeURIComponent('请输入有效的手机号'))
    }

    // Validate password length
    if (password.length < 6) {
      redirect('/login?error=' + encodeURIComponent('密码长度至少6位'))
    }

    const existingUser = await getUserByPhone(phone)

    if (existingUser) {
      redirect('/login?error=' + encodeURIComponent('该手机号已注册'))
    }

    const passwordHash = await hashPassword(password)
    const userId = await createUser(phone, passwordHash)
    
    // Create default ledger for new user
    await ensureDefaultLedger(userId)

    await createSession(userId, phone)

    // Set a temporary cookie to trigger the welcome dialog
    const cookieStore = await cookies()
    cookieStore.set('fm_welcome_gift', 'true', { 
        maxAge: 60, // 1 minute
        path: '/',
        httpOnly: false // Client needs to read/delete it? No, server reads it.
    })

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error: any) {
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Signup error:', error)
    redirect('/login?error=' + encodeURIComponent(error.message || '注册失败'))
  }
}

