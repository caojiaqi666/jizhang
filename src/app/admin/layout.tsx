import { redirect } from 'next/navigation'
import { getAdminSession } from '@/utils/auth/session'
import { adminLogout } from './actions'
import Link from 'next/link'
import { LayoutDashboard, Users, FolderOpen, CreditCard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  // If on login page, don't show layout
  if (!session) {
    return <>{children}</>
  }

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: '仪表盘' },
    { href: '/admin/users', icon: Users, label: '用户管理' },
    { href: '/admin/categories', icon: FolderOpen, label: '分类管理' },
    { href: '/admin/transactions', icon: CreditCard, label: '交易记录' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">FlowMoney</h1>
          <p className="text-sm text-slate-400">管理后台</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <form action={adminLogout}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-white hover:bg-slate-700"
            >
              <LogOut className="w-5 h-5 mr-3" />
              退出登录
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

