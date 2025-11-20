'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PieChart, Plus, Compass, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RecordDrawer } from './record-drawer'
import { useState } from 'react'
import { useTheme, THEME_VARIANTS } from './theme-provider'

export function BottomNav() {
  const pathname = usePathname()
  const [isRecordOpen, setIsRecordOpen] = useState(false)
  const { primaryColor } = useTheme()
  const theme = THEME_VARIANTS[primaryColor]

  const navItems = [
    { href: '/', label: '明细', icon: Home },
    { href: '/stats', label: '统计', icon: PieChart },
    { href: '/add', label: '记账', icon: Plus, isFab: true }, // Special handling
    { href: '/discovery', label: '发现', icon: Compass },
    { href: '/profile', label: '我的', icon: User },
  ]

  return (
    <div className="sticky bottom-0 inset-x-0 z-50">
      <div 
        className="mx-auto max-w-md border-t bg-white/95 backdrop-blur pt-2 px-4 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: 'calc(0.5rem + var(--safe-area-inset-bottom, 0px))' }}
      >
      <nav className="flex justify-around items-end h-[60px] pb-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          if (item.isFab) {
            return (
              <div key={item.href} className="relative -top-5">
                <RecordDrawer open={isRecordOpen} onOpenChange={setIsRecordOpen}>
                    <Button
                    className={cn("rounded-full w-14 h-14 shadow-lg flex items-center justify-center", theme.bg)}
                    >
                    <Plus className="text-white w-8 h-8" />
                    </Button>
                </RecordDrawer>
                <span className="sr-only">记账</span>
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-12 transition-colors duration-200",
                isActive ? theme.text : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-current opacity-20 stroke-[2.5px]")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      </div>
    </div>
  )
}
