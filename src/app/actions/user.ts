'use server'

import { revalidatePath } from "next/cache"
import { getSession } from "@/utils/auth/session"
import { getUserById, updateUserProfile as dbUpdateUserProfile, updateUserMembership, checkAndUpdateExpiredMemberships, updateUserPassword } from "@/utils/mysql/user"
import { hashPassword, verifyPassword } from "@/utils/auth/password"
import { writeFile } from 'fs/promises'
import path from 'path'

export type UserProfile = {
// ...
// ... keep existing types
    id: number
    phone: string
    email: string | null
    display_name: string | null
    avatar_url: string | null
    membership_tier: "free" | "pro"
    is_pro: boolean
    pro_expires_at: Date | null
    trial_started_at: Date | null
    trial_ends_at: Date | null
    monthly_savings_goal: number | null
    monthly_savings_enabled: boolean
}

export async function changePassword(oldPassword: string, newPassword: string) {
    try {
        const session = await getSession()
        if (!session) throw new Error("Unauthorized")

        const user = await getUserById(session.userId)
        if (!user) throw new Error("User not found")

        const isValid = await verifyPassword(oldPassword, user.password_hash)
        if (!isValid) {
            return { success: false, error: "旧密码错误" }
        }

        const newHash = await hashPassword(newPassword)
        await updateUserPassword(user.id, newHash)

        return { success: true }
    } catch (e: any) {
        console.error("Change password error:", e)
        return { success: false, error: e.message }
    }
}

export async function getUserProfile(): Promise<UserProfile | null> {
    try {
        const session = await getSession()
        if (!session) return null

        // Check and update expired memberships
        await checkAndUpdateExpiredMemberships()

        const user = await getUserById(session.userId)
        if (!user) return null

        return {
            id: user.id,
            phone: user.phone,
            email: user.email,
            display_name: user.display_name,
            avatar_url: user.avatar_url,
            membership_tier: user.membership_tier,
            is_pro: user.is_pro,
            pro_expires_at: user.pro_expires_at,
            trial_started_at: user.trial_started_at,
            trial_ends_at: user.trial_ends_at,
            monthly_savings_goal: user.monthly_savings_goal,
            monthly_savings_enabled: user.monthly_savings_enabled
        }
    } catch (e) {
        console.error("Server Action getUserProfile failed:", e)
        return null
    }
}

export async function updateSavingsSettings(enabled: boolean, goal: number) {
    try {
        const session = await getSession()
        if (!session) throw new Error("Unauthorized")

        await dbUpdateUserProfile(session.userId, {
            monthly_savings_enabled: enabled,
            monthly_savings_goal: goal
        })

        revalidatePath('/profile')
        revalidatePath('/') // Update dashboard
        return { success: true }
    } catch (e: any) {
        console.error("Server Action updateSavingsSettings failed:", e)
        return { success: false, error: e.message }
    }
}

export async function upgradeToPro() {
    try {
        const session = await getSession()
        if (!session) throw new Error("Unauthorized")

        // In a production app this would be triggered by a payment webhook
        await updateUserMembership(session.userId, true, null)

        revalidatePath('/profile')
        return { success: true }
    } catch (e: any) {
        console.error("Server Action upgradeToPro failed:", e)
        return { success: false, error: e.message }
    }
}

export async function updateProfileAvatar(avatarUrl: string) {
    try {
        const session = await getSession()
        if (!session) throw new Error("Unauthorized")

        await dbUpdateUserProfile(session.userId, {
            avatar_url: avatarUrl
        })

        revalidatePath('/profile')
        return { success: true }
    } catch (e: any) {
        console.error("Server Action updateProfileAvatar failed:", e)
        return { success: false, error: e.message }
    }
}

export async function uploadAvatar(formData: FormData) {
    try {
        const session = await getSession()
        if (!session) throw new Error("Unauthorized")

        const file = formData.get('file') as File
        if (!file) throw new Error("No file uploaded")

        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error("Only image files are allowed")
        }
        
        // Validate file size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error("File size exceeds 5MB")
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = `avatar-${session.userId}-${Date.now()}${path.extname(file.name)}`
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        const filepath = path.join(uploadDir, filename)

        await writeFile(filepath, buffer)
        
        const avatarUrl = `/uploads/${filename}`
        
        await dbUpdateUserProfile(session.userId, {
            avatar_url: avatarUrl
        })

        revalidatePath('/profile')
        return { success: true, url: avatarUrl }
    } catch (e: any) {
        console.error("Server Action uploadAvatar failed:", e)
        return { success: false, error: e.message }
    }
}
