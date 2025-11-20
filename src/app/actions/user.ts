'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import type { SupabaseClient, User } from "@supabase/supabase-js"

export type UserProfile = {
    id: string
    email: string | null
    display_name: string | null
    avatar_url: string | null
    membership_tier: "free" | "pro"
    is_pro: boolean
    pro_expires_at: string | null
    trial_started_at: string | null
    trial_ends_at: string | null
    monthly_savings_goal: number | null
    monthly_savings_enabled: boolean | null
}

const PROFILE_SELECT = 'id, email, display_name, avatar_url, membership_tier, is_pro, pro_expires_at, trial_started_at, trial_ends_at, monthly_savings_goal, monthly_savings_enabled'
const TRIAL_DAYS = 7

function addDays(date: Date, days: number) {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

export async function ensureProfileRecord(
    supabase: SupabaseClient<any, "public", any>,
    user: User
): Promise<UserProfile> {
    const now = new Date()
    const { data, error } = await supabase
        .from('users')
        .select(PROFILE_SELECT)
        .eq('id', user.id)
        .maybeSingle()

    if (error) {
        console.error("Supabase error when fetching profile:", error)
        throw error
    }

    if (!data) {
        const trialEndsAt = addDays(now, TRIAL_DAYS)
        const payload = {
            id: user.id,
            email: user.email,
            display_name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? "FlowMoney 用户",
            avatar_url: user.user_metadata?.avatar_url ?? null,
            membership_tier: 'pro',
            is_pro: true,
            pro_expires_at: trialEndsAt.toISOString(),
            trial_started_at: now.toISOString(),
            trial_ends_at: trialEndsAt.toISOString(),
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
        }

        const { data: inserted, error: insertError } = await supabase
            .from('users')
            .insert(payload)
            .select(PROFILE_SELECT)
            .single()

        if (insertError) {
            console.error("Supabase error when creating profile:", insertError)
            throw insertError
        }
        return inserted as UserProfile
    }

    let profile = data as UserProfile
    const updates: Partial<UserProfile> & { updated_at?: string } = {}

    if (profile.pro_expires_at) {
        const expiresAt = new Date(profile.pro_expires_at)
        if (expiresAt <= now && (profile.is_pro || profile.membership_tier !== 'free')) {
            updates.is_pro = false
            updates.membership_tier = 'free'
            updates.pro_expires_at = null
            updates.trial_started_at = null
            updates.trial_ends_at = null
        } else if (expiresAt > now && !profile.is_pro) {
            updates.is_pro = true
            updates.membership_tier = 'pro'
        }
    }

    if (Object.keys(updates).length > 0) {
        updates.updated_at = now.toISOString()
        const { data: refreshed, error: updateError } = await supabase
            .from('users')
            .update(updates)
            .eq('id', user.id)
            .select(PROFILE_SELECT)
            .single()

        if (updateError) {
            console.error("Supabase error when updating profile:", updateError)
            throw updateError
        }
        profile = refreshed as UserProfile
    }

    return profile
}

export async function getUserProfile() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null
        return await ensureProfileRecord(supabase, user)
    } catch (e) {
        console.error("Server Action getUserProfile failed:", e)
        return null
    }
}

export async function updateSavingsSettings(enabled: boolean, goal: number) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const { error } = await supabase
            .from('users')
            .update({
                monthly_savings_enabled: enabled,
                monthly_savings_goal: goal,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        if (error) throw error
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
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        await ensureProfileRecord(supabase, user)

        // In a production app this would be triggered by a payment webhook
        const { error } = await supabase
            .from('users')
            .update({
                is_pro: true,
                membership_tier: 'pro',
                pro_expires_at: null,
                trial_started_at: null,
                trial_ends_at: null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        if (error) throw error
        revalidatePath('/profile')
        return { success: true }
    } catch (e: any) {
        console.error("Server Action upgradeToPro failed:", e)
        return { success: false, error: e.message }
    }
}

export async function updateProfileAvatar(avatarUrl: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const { error } = await supabase
            .from('users')
            .update({
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        if (error) throw error
        revalidatePath('/profile')
        return { success: true }
    } catch (e: any) {
        console.error("Server Action updateProfileAvatar failed:", e)
        return { success: false, error: e.message }
    }
}

export async function uploadAvatar(file: File) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        // 生成唯一文件名
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        // 上传文件到 Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('user-files')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) throw uploadError

        // 获取公共URL
        const { data: { publicUrl } } = supabase.storage
            .from('user-files')
            .getPublicUrl(filePath)

        // 更新用户profile中的avatar_url
        const { error: updateError } = await supabase
            .from('users')
            .update({
                avatar_url: publicUrl,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        if (updateError) throw updateError

        revalidatePath('/profile')
        return { success: true, url: publicUrl }
    } catch (e: any) {
        console.error("Server Action uploadAvatar failed:", e)
        return { success: false, error: e.message }
    }
}
