"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { getUserProfile, type UserProfile } from "@/app/actions/user"

interface MembershipContextValue {
  loading: boolean
  profile: UserProfile | null
  isPro: boolean
  isTrial: boolean
  trialDaysLeft: number
  refreshProfile: () => Promise<void>
}

const MembershipContext = createContext<MembershipContextValue | undefined>(undefined)

function calculateTrialDaysLeft(profile: UserProfile | null) {
  if (!profile?.trial_ends_at) return 0
  const now = new Date()
  const ends = new Date(profile.trial_ends_at)
  if (ends <= now) return 0
  const diff = ends.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function MembershipProvider({ children }: { children: ReactNode }) {
  console.log('[MembershipProvider] component render')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const hydrate = useCallback(async () => {
    try {
      console.log('[MembershipProvider] hydrate called')
      setLoading(true)
      const data = await getUserProfile()
      setProfile(data)
    } catch (error) {
      console.error("Failed to load user profile:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    console.log('[MembershipProvider] useEffect mount')
    hydrate()
    
    return () => {
      console.log('[MembershipProvider] useEffect unmount')
    }
  }, [])

  const isPro = Boolean(profile?.is_pro)
  const trialDaysLeft = calculateTrialDaysLeft(profile)
  const isTrial = Boolean(profile?.trial_ends_at && trialDaysLeft > 0)

  return (
    <MembershipContext.Provider
      value={{
        loading,
        profile,
        isPro,
        isTrial,
        trialDaysLeft,
        refreshProfile: hydrate,
      }}
    >
      {children}
    </MembershipContext.Provider>
  )
}

export function useMembership() {
  const context = useContext(MembershipContext)
  if (!context) throw new Error("useMembership must be used within MembershipProvider")
  return context
}

