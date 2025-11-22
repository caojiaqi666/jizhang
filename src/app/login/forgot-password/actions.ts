'use server'

import { getUserByPhone, updateUserPassword } from '@/utils/mysql/user'
import { hashPassword } from '@/utils/auth/password'
import { redirect } from 'next/navigation'

export async function checkPhone(phone: string) {
    const user = await getUserByPhone(phone)
    if (!user) {
        return { success: false, message: "该手机号未注册" }
    }
    return { success: true }
}

export async function resetPassword(phone: string, newPassword: string) {
    if (newPassword.length < 8) { // Updated rule based on user request for better security
        return { success: false, message: "密码长度至少8位" }
    }

    try {
        const user = await getUserByPhone(phone)
        if (!user) {
            return { success: false, message: "用户不存在" }
        }

        const passwordHash = await hashPassword(newPassword)
        await updateUserPassword(user.id, passwordHash)
        
        return { success: true }
    } catch (error) {
        console.error("Reset password error:", error)
        return { success: false, message: "重置失败，请稍后重试" }
    }
}

