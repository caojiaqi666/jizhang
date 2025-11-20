"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type ThemeColor = "teal" | "rose" | "indigo" | "emerald" | "violet" | "slate"

export interface ThemeContextType {
  primaryColor: ThemeColor
  setPrimaryColor: (color: ThemeColor) => void
  backgroundImage: string | null
  setBackgroundImage: (url: string | null) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const THEME_COLORS: Record<ThemeColor, string> = {
  teal: "bg-gradient-to-br from-teal-400 to-teal-600",
  rose: "bg-gradient-to-br from-rose-400 to-rose-600",
  indigo: "bg-gradient-to-br from-indigo-400 to-indigo-600",
  emerald: "bg-gradient-to-br from-emerald-400 to-emerald-600",
  violet: "bg-gradient-to-br from-violet-400 to-violet-600",
  slate: "bg-gradient-to-br from-slate-600 to-slate-800",
}

export const THEME_VARIANTS: Record<ThemeColor, {
    bg: string
    text: string
    border: string
    lightBg: string
    lightText: string
    ring: string
    progress: string
    activeItem: string
    mainGradient: string
}> = {
    teal: {
        bg: "bg-teal-600 hover:bg-teal-700",
        text: "text-teal-600",
        border: "border-teal-600",
        lightBg: "bg-teal-50",
        lightText: "text-teal-700",
        ring: "focus-visible:ring-teal-600",
        progress: "bg-teal-600",
        activeItem: "text-teal-600 bg-teal-50",
        mainGradient: "bg-gradient-to-br from-teal-50/80 via-white to-teal-50/80"
    },
    rose: {
        bg: "bg-rose-500 hover:bg-rose-600",
        text: "text-rose-500",
        border: "border-rose-500",
        lightBg: "bg-rose-50",
        lightText: "text-rose-700",
        ring: "focus-visible:ring-rose-500",
        progress: "bg-rose-500",
        activeItem: "text-rose-500 bg-rose-50",
        mainGradient: "bg-gradient-to-br from-rose-50/80 via-white to-rose-50/80"
    },
    indigo: {
        bg: "bg-indigo-600 hover:bg-indigo-700",
        text: "text-indigo-600",
        border: "border-indigo-600",
        lightBg: "bg-indigo-50",
        lightText: "text-indigo-700",
        ring: "focus-visible:ring-indigo-600",
        progress: "bg-indigo-600",
        activeItem: "text-indigo-600 bg-indigo-50",
        mainGradient: "bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/80"
    },
    emerald: {
        bg: "bg-emerald-600 hover:bg-emerald-700",
        text: "text-emerald-600",
        border: "border-emerald-600",
        lightBg: "bg-emerald-50",
        lightText: "text-emerald-700",
        ring: "focus-visible:ring-emerald-600",
        progress: "bg-emerald-600",
        activeItem: "text-emerald-600 bg-emerald-50",
        mainGradient: "bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/80"
    },
    violet: {
        bg: "bg-violet-600 hover:bg-violet-700",
        text: "text-violet-600",
        border: "border-violet-600",
        lightBg: "bg-violet-50",
        lightText: "text-violet-700",
        ring: "focus-visible:ring-violet-600",
        progress: "bg-violet-600",
        activeItem: "text-violet-600 bg-violet-50",
        mainGradient: "bg-gradient-to-br from-violet-50/80 via-white to-violet-50/80"
    },
    slate: {
        bg: "bg-slate-700 hover:bg-slate-800",
        text: "text-slate-700",
        border: "border-slate-700",
        lightBg: "bg-slate-100",
        lightText: "text-slate-800",
        ring: "focus-visible:ring-slate-700",
        progress: "bg-slate-700",
        activeItem: "text-slate-700 bg-slate-100",
        mainGradient: "bg-gradient-to-br from-slate-100/80 via-white to-slate-100/80"
    }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState<ThemeColor>("teal")
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const savedColor = localStorage.getItem("theme-color") as ThemeColor
    const savedBg = localStorage.getItem("theme-bg")
    if (savedColor && THEME_COLORS[savedColor]) {
      setPrimaryColor(savedColor)
    }
    if (savedBg) {
      setBackgroundImage(savedBg)
    }
  }, [])

  // Save to localStorage
  const updatePrimaryColor = (color: ThemeColor) => {
    setPrimaryColor(color)
    localStorage.setItem("theme-color", color)
  }

  const updateBackgroundImage = (url: string | null) => {
    setBackgroundImage(url)
    if (url) localStorage.setItem("theme-bg", url)
    else localStorage.removeItem("theme-bg")
  }

  return (
    <ThemeContext.Provider value={{ 
      primaryColor, 
      setPrimaryColor: updatePrimaryColor,
      backgroundImage,
      setBackgroundImage: updateBackgroundImage
    }}>
      {/* Global Background Layer */}
      {backgroundImage && (
        <div 
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-30 blur-[2px] h-[100dvh]"
          // style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

