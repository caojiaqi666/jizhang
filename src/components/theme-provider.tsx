"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type ThemeColor = "mint" | "butter" | "peach" | "ice" | "lavender" | "midnight"

export interface ThemeContextType {
  primaryColor: ThemeColor
  setPrimaryColor: (color: ThemeColor) => void
  backgroundImage: string | null
  setBackgroundImage: (url: string | null) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const THEME_COLORS: Record<ThemeColor, string> = {
  mint: "bg-gradient-to-br from-[#88D8B0] to-[#6BC7A0]",
  butter: "bg-gradient-to-br from-[#FFD56F] to-[#FFCA40]",
  peach: "bg-gradient-to-br from-[#FF9AA2] to-[#FF8090]",
  ice: "bg-gradient-to-br from-[#A0E7E5] to-[#80D0D0]",
  lavender: "bg-gradient-to-br from-[#B5B5E5] to-[#9090C0]",
  midnight: "bg-gradient-to-br from-[#2E2D4D] to-[#1A1B3B]",
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
    mint: {
        bg: "bg-[#88D8B0] hover:bg-[#76C49C]",
        text: "text-[#88D8B0]",
        border: "border-[#88D8B0]",
        lightBg: "bg-[#88D8B0]/10",
        lightText: "text-[#6BC7A0]",
        ring: "focus-visible:ring-[#88D8B0]",
        progress: "bg-[#88D8B0]",
        activeItem: "text-[#88D8B0] bg-[#88D8B0]/10",
        mainGradient: "bg-gradient-to-br from-[#88D8B0]/20 via-white to-[#88D8B0]/20"
    },
    butter: {
        bg: "bg-[#FFD56F] hover:bg-[#FFCA40]",
        text: "text-[#FFD56F]",
        border: "border-[#FFD56F]",
        lightBg: "bg-[#FFD56F]/10",
        lightText: "text-[#E6B040]",
        ring: "focus-visible:ring-[#FFD56F]",
        progress: "bg-[#FFD56F]",
        activeItem: "text-[#FFD56F] bg-[#FFD56F]/10",
        mainGradient: "bg-gradient-to-br from-[#FFD56F]/20 via-white to-[#FFD56F]/20"
    },
    peach: {
        bg: "bg-[#FF9AA2] hover:bg-[#FF8090]",
        text: "text-[#FF9AA2]",
        border: "border-[#FF9AA2]",
        lightBg: "bg-[#FF9AA2]/10",
        lightText: "text-[#E67080]",
        ring: "focus-visible:ring-[#FF9AA2]",
        progress: "bg-[#FF9AA2]",
        activeItem: "text-[#FF9AA2] bg-[#FF9AA2]/10",
        mainGradient: "bg-gradient-to-br from-[#FF9AA2]/20 via-white to-[#FF9AA2]/20"
    },
    ice: {
        bg: "bg-[#A0E7E5] hover:bg-[#80D0D0]",
        text: "text-[#A0E7E5]",
        border: "border-[#A0E7E5]",
        lightBg: "bg-[#A0E7E5]/10",
        lightText: "text-[#70C0C0]",
        ring: "focus-visible:ring-[#A0E7E5]",
        progress: "bg-[#A0E7E5]",
        activeItem: "text-[#A0E7E5] bg-[#A0E7E5]/10",
        mainGradient: "bg-gradient-to-br from-[#A0E7E5]/20 via-white to-[#A0E7E5]/20"
    },
    lavender: {
        bg: "bg-[#B5B5E5] hover:bg-[#9090C0]",
        text: "text-[#B5B5E5]",
        border: "border-[#B5B5E5]",
        lightBg: "bg-[#B5B5E5]/10",
        lightText: "text-[#8080B0]",
        ring: "focus-visible:ring-[#B5B5E5]",
        progress: "bg-[#B5B5E5]",
        activeItem: "text-[#B5B5E5] bg-[#B5B5E5]/10",
        mainGradient: "bg-gradient-to-br from-[#B5B5E5]/20 via-white to-[#B5B5E5]/20"
    },
    midnight: {
        bg: "bg-[#2E2D4D] hover:bg-[#1A1B3B]",
        text: "text-[#2E2D4D]",
        border: "border-[#2E2D4D]",
        lightBg: "bg-[#2E2D4D]/10",
        lightText: "text-[#1A1B3B]",
        ring: "focus-visible:ring-[#2E2D4D]",
        progress: "bg-[#2E2D4D]",
        activeItem: "text-[#2E2D4D] bg-[#2E2D4D]/10",
        mainGradient: "bg-gradient-to-br from-[#2E2D4D]/20 via-white to-[#2E2D4D]/20"
    }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState<ThemeColor>("mint")
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

  // Sync CSS variables
  useEffect(() => {
    const root = document.documentElement
    const colorMap: Record<ThemeColor, string> = {
       mint: "#88D8B0",
       butter: "#FFD56F",
       peach: "#FF9AA2",
       ice: "#A0E7E5",
       lavender: "#B5B5E5",
       midnight: "#2E2D4D"
    }
    // We update the --primary variable to match the selected theme
    root.style.setProperty("--primary", colorMap[primaryColor])
    root.style.setProperty("--ring", colorMap[primaryColor])
  }, [primaryColor])

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
