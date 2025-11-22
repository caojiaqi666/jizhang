'use server'

import { revalidatePath } from "next/cache"
import { getSession } from "@/utils/auth/session"
import { getLedgersByUserId, createLedger as dbCreateLedger, deleteLedger as dbDeleteLedger, updateLedger as dbUpdateLedger, ensureDefaultLedger } from "@/utils/mysql/ledger"
import { getUserById } from "@/utils/mysql/user"

export interface Ledger {
    id: number
    name: string
    is_default: boolean
    created_at: Date
}

export async function getLedgers(): Promise<Ledger[]> {
    try {
        const session = await getSession()
        if (!session) return []

        let ledgers = await getLedgersByUserId(session.userId)
        
        // If user has no ledgers, automatically create a default one
        if (!ledgers || ledgers.length === 0) {
            console.log("No ledgers found, creating default ledger for user:", session.userId)
            await ensureDefaultLedger(session.userId)
            ledgers = await getLedgersByUserId(session.userId)
        }

        return ledgers.map(l => ({
            id: l.id,
            name: l.name,
            is_default: l.is_default,
            created_at: l.created_at
        }))
    } catch (e) {
        console.error("Server Action getLedgers failed:", e)
        return []
    }
}

export async function createLedger(name: string) {
    try {
        const session = await getSession()
        if (!session) throw new Error("Unauthorized")

        const user = await getUserById(session.userId)
        if (!user || !user.is_pro) {
            throw new Error("该功能为 Pro 会员专享")
        }

        await dbCreateLedger(session.userId, name, false)
        
        revalidatePath('/profile/ledgers')
        return { success: true }
    } catch (e: any) {
        console.error("Server Action createLedger failed:", e)
        return { success: false, error: e.message }
    }
}

export async function deleteLedger(id: number) {
    try {
        const session = await getSession()
        if (!session) throw new Error("Unauthorized")

        const user = await getUserById(session.userId)
        if (!user || !user.is_pro) {
            throw new Error("该功能为 Pro 会员专享")
        }

        await dbDeleteLedger(id)
        
        revalidatePath('/profile/ledgers')
        return { success: true }
    } catch (e: any) {
        console.error("Server Action deleteLedger failed:", e)
        return { success: false, error: e.message }
    }
}

export async function updateLedger(id: number, name: string) {
    try {
        const session = await getSession()
        if (!session) throw new Error("Unauthorized")

        const user = await getUserById(session.userId)
        if (!user || !user.is_pro) {
            throw new Error("该功能为 Pro 会员专享")
        }

        await dbUpdateLedger(id, name)
        
        revalidatePath('/profile/ledgers')
        return { success: true }
    } catch (e: any) {
        console.error("Server Action updateLedger failed:", e)
        return { success: false, error: e.message }
    }
}
