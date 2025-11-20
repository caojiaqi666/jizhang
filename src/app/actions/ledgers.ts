'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { ensureProfileRecord } from "@/app/actions/user"

export interface Ledger {
    id: string
    name: string
    is_default: boolean
    created_at: string
}

export async function getLedgers(): Promise<Ledger[]> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return []

        const { data, error } = await supabase
            .from('ledgers')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true })
        
        if (error) {
            console.error("Supabase error in getLedgers:", error)
            return []
        }

        // If user has no ledgers, automatically create a default one
        if (!data || data.length === 0) {
            console.log("No ledgers found, creating default ledger for user:", user.id)
            const { data: newLedger, error: createError } = await supabase
                .from('ledgers')
                .insert({
                    user_id: user.id,
                    name: '默认账本',
                    is_default: true
                })
                .select()
                .single()
            
            if (createError) {
                console.error("Failed to auto-create default ledger:", createError)
                return []
            }
            return [newLedger]
        }

        return data
    } catch (e) {
        console.error("Server Action getLedgers failed:", e)
        return []
    }
}

export async function createLedger(name: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const profile = await ensureProfileRecord(supabase, user)
        if (!profile.is_pro) {
            throw new Error("该功能为 Pro 会员专享")
        }

        const { error } = await supabase.from('ledgers').insert({
            user_id: user.id,
            name,
            is_default: false
        })

        if (error) throw error
        revalidatePath('/profile/ledgers')
        return { success: true }
    } catch (e: any) {
        console.error("Server Action createLedger failed:", e)
        return { success: false, error: e.message }
    }
}

export async function deleteLedger(id: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const profile = await ensureProfileRecord(supabase, user)
        if (!profile.is_pro) {
            throw new Error("该功能为 Pro 会员专享")
        }

        const { error } = await supabase.from('ledgers').delete().eq('id', id).eq('user_id', user.id)
        if (error) throw error
        revalidatePath('/profile/ledgers')
        return { success: true }
    } catch (e: any) {
        console.error("Server Action deleteLedger failed:", e)
        return { success: false, error: e.message }
    }
}

export async function updateLedger(id: string, name: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const profile = await ensureProfileRecord(supabase, user)
        if (!profile.is_pro) {
            throw new Error("该功能为 Pro 会员专享")
        }

        const { error } = await supabase.from('ledgers').update({ name }).eq('id', id)
        if (error) throw error
        revalidatePath('/profile/ledgers')
        return { success: true }
    } catch (e: any) {
        console.error("Server Action updateLedger failed:", e)
        return { success: false, error: e.message }
    }
}
