"use client"

import { BottomNav } from '@/components/bottom-nav'
import { useTheme, THEME_VARIANTS } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { backgroundImage, primaryColor } = useTheme()
  const theme = THEME_VARIANTS[primaryColor]

  const outerStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(135deg, rgba(5,10,20,0.85), rgba(15,25,35,0.75)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined

  return (
    <div className="min-h-screen transition-colors duration-500 bg-gray-50">
      <div
        className={cn(
          "max-w-md mx-auto min-h-screen shadow-2xl relative transition-all duration-500 flex flex-col",
          theme.mainGradient // Apply theme gradient as default
        )}
      >
        {/* Mobile container simulation for desktop */}
        <div className="flex-1 w-full">{children}</div>
        <BottomNav />
      </div>
    </div>
  )
}

