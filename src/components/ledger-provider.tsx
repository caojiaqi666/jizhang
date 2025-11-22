"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Ledger, getLedgers } from "@/app/actions/ledgers"

interface LedgerContextType {
  currentLedger: Ledger | null
  ledgers: Ledger[]
  loading: boolean
  setCurrentLedger: (ledger: Ledger) => void
  refreshLedgers: () => Promise<void>
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined)

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const [ledgers, setLedgers] = useState<Ledger[]>([])
  const [currentLedger, setCurrentLedger] = useState<Ledger | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshLedgers = async () => {
      try {
          setLoading(true)
          const data = await getLedgers()
          setLedgers(data)
          
          // Sync with local storage or set default
          const savedId = typeof window !== 'undefined' ? localStorage.getItem("current-ledger-id") : null
          const saved = data.find(l => l.id === savedId)
          const defaultLedger = data.find(l => l.is_default)
          
          if (saved) {
              setCurrentLedger(saved)
          } else if (defaultLedger) {
              setCurrentLedger(defaultLedger)
              if (typeof window !== 'undefined') localStorage.setItem("current-ledger-id", defaultLedger.id.toString())
          } else if (data.length > 0) {
              setCurrentLedger(data[0])
              if (typeof window !== 'undefined') localStorage.setItem("current-ledger-id", data[0].id.toString())
          }
      } catch (error) {
          console.error("Failed to refresh ledgers:", error)
      } finally {
          setLoading(false)
      }
  }

  useEffect(() => {
      refreshLedgers()
  }, [])

  const updateCurrentLedger = (ledger: Ledger) => {
      setCurrentLedger(ledger)
      if (typeof window !== 'undefined') localStorage.setItem("current-ledger-id", ledger.id.toString())
  }

  return (
    <LedgerContext.Provider value={{ 
        currentLedger, 
        ledgers, 
        loading,
        setCurrentLedger: updateCurrentLedger,
        refreshLedgers
    }}>
      {children}
    </LedgerContext.Provider>
  )
}

export function useLedger() {
  const context = useContext(LedgerContext)
  if (context === undefined) {
    throw new Error("useLedger must be used within a LedgerProvider")
  }
  return context
}
