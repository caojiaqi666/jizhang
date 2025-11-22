import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { query, queryOne } from '@/utils/mysql/client'
import type { RowDataPacket } from 'mysql2/promise'

async function getStats() {
  const totalUsers = await queryOne<RowDataPacket>(
    'SELECT COUNT(*) as count FROM users'
  )
  
  const proUsers = await queryOne<RowDataPacket>(
    'SELECT COUNT(*) as count FROM users WHERE is_pro = TRUE'
  )
  
  const totalTransactions = await queryOne<RowDataPacket>(
    'SELECT COUNT(*) as count FROM transactions'
  )
  
  const totalCategories = await queryOne<RowDataPacket>(
    'SELECT COUNT(*) as count FROM categories WHERE user_id IS NULL'
  )
  
  const recentUsers = await query<RowDataPacket>(
    'SELECT phone, display_name, created_at FROM users ORDER BY created_at DESC LIMIT 5'
  )

  return {
    totalUsers: totalUsers?.count || 0,
    proUsers: proUsers?.count || 0,
    freeUsers: (totalUsers?.count || 0) - (proUsers?.count || 0),
    totalTransactions: totalTransactions?.count || 0,
    totalCategories: totalCategories?.count || 0,
    recentUsers
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-600 mt-2">系统概览</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">总用户数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Pro 会员</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{stats.proUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">免费用户</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-600">{stats.freeUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">总交易记录</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stats.totalTransactions}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>最近注册用户</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentUsers.map((user: any, index: number) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{user.display_name}</p>
                  <p className="text-sm text-gray-500">{user.phone}</p>
                </div>
                <p className="text-sm text-gray-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

