'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PieChart, Plus, Compass, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RecordDrawer } from './record-drawer'
import { useState } from 'react'

export function BottomNav() {
  const pathname = usePathname()
  const [isRecordOpen, setIsRecordOpen] = useState(false)

  const navItems = [
    { href: '/', label: '明细', icon: Home },
    { href: '/stats', label: '统计', icon: PieChart },
    { href: '/add', label: '记账', icon: Plus, isFab: true },
    { href: '/discovery', label: '发现', icon: Compass },
    { href: '/profile', label: '我的', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[80px] bg-[rgba(255,255,255,0.95)] backdrop-blur-xl rounded-t-[30px] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] flex items-center justify-around pb-[env(safe-area-inset-bottom)] border-t border-white/50">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        if (item.isFab) {
          return (
            <div key={item.href} className="relative -top-8">
              <RecordDrawer open={isRecordOpen} onOpenChange={setIsRecordOpen}>
                  <Button
                    className={cn(
                        "rounded-full w-[72px] h-[72px] shadow-[var(--shadow-float)] flex items-center justify-center border-[4px] border-white transition-all duration-300 hover:-translate-y-1 hover:rotate-90 active:scale-90 bg-accent hover:bg-accent text-white"
                    )}
                  >
                    <Plus className="w-9 h-9 stroke-[3px]" />
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
              "flex flex-col items-center justify-center w-[60px] h-full gap-1 cursor-pointer active:scale-90 transition-all duration-200",
              isActive ? "text-primary" : "text-[#C4C4C4]"
            )}
          >
            <Icon 
                className={cn(
                    "w-[22px] h-[22px] transition-transform duration-200 mb-1", 
                )} 
            />
            <span className={cn("text-[10px]", isActive ? "font-bold" : "font-medium")}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
