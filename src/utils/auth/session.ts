import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production'
const SESSION_COOKIE = 'fm_session'
const ADMIN_SESSION_COOKIE = 'fm_admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 100 // 100 years

export interface SessionPayload {
  userId: number
  phone: string
}

export interface AdminSessionPayload {
  adminId: number
  username: string
}

export async function createSession(userId: number, phone: string) {
  const payload: SessionPayload = { userId, phone }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '36500d' }) // ~100 years
  
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // 在https模式下才会保存cookie
    // secure: process.env.NODE_ENV === 'production',
    secure: false,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  })
  
  return token
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    
    if (!token) return null
    
    const payload = jwt.verify(token, JWT_SECRET) as SessionPayload
    return payload
  } catch (error) {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function createAdminSession(adminId: number, username: string) {
  const payload: AdminSessionPayload = { adminId, username }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '36500d' })
  
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
    path: '/admin',
    sameSite: 'lax',
  })
  
  return token
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
    
    if (!token) return null
    
    const payload = jwt.verify(token, JWT_SECRET) as AdminSessionPayload
    return payload
  } catch (error) {
    return null
  }
}

export async function deleteAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

