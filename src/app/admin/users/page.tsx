'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { getUsers, updateUserMembershipAction } from '../actions'
import { Search } from 'lucide-react'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [membershipDays, setMembershipDays] = useState('7')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const result = await getUsers(page, search)
      setUsers(result.users)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchUsers()
  }

  const handleUpgradeToPro = async (userId: number, days: number) => {
    try {
      await updateUserMembershipAction(userId, true, days)
      alert('升级成功！')
      fetchUsers()
    } catch (error) {
      alert('升级失败：' + (error as any).message)
    }
  }

  const handleDowngradeToFree = async (userId: number) => {
    try {
      await updateUserMembershipAction(userId, false)
      alert('降级成功！')
      fetchUsers()
    } catch (error) {
      alert('降级失败：' + (error as any).message)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
        <p className="text-gray-600 mt-2">管理所有用户和会员信息</p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="搜索手机号或用户名..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>搜索</Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">暂无用户</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 font-medium text-gray-600">手机号</th>
                      <th className="pb-3 font-medium text-gray-600">用户名</th>
                      <th className="pb-3 font-medium text-gray-600">会员类型</th>
                      <th className="pb-3 font-medium text-gray-600">到期时间</th>
                      <th className="pb-3 font-medium text-gray-600">注册时间</th>
                      <th className="pb-3 font-medium text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="py-4">{user.phone}</td>
                        <td className="py-4">{user.display_name}</td>
                        <td className="py-4">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            user.is_pro ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.is_pro ? 'Pro' : 'Free'}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {user.pro_expires_at ? new Date(user.pro_expires_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                管理会员
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>管理会员 - {user.display_name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div>
                                  <p className="text-sm text-gray-600 mb-2">当前状态: {user.is_pro ? 'Pro 会员' : '免费用户'}</p>
                                  {user.pro_expires_at && (
                                    <p className="text-sm text-gray-600">到期时间: {new Date(user.pro_expires_at).toLocaleString()}</p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="days">升级为 Pro（天数）</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id="days"
                                      type="number"
                                      value={membershipDays}
                                      onChange={(e) => setMembershipDays(e.target.value)}
                                      placeholder="输入天数"
                                      min="1"
                                    />
                                    <Button
                                      onClick={() => {
                                        handleUpgradeToPro(user.id, parseInt(membershipDays))
                                      }}
                                    >
                                      升级
                                    </Button>
                                  </div>
                                  <div className="flex gap-2 text-sm">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setMembershipDays('7')}
                                    >
                                      7天
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setMembershipDays('30')}
                                    >
                                      30天
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setMembershipDays('365')}
                                    >
                                      365天
                                    </Button>
                                  </div>
                                </div>

                                {user.is_pro && (
                                  <div className="pt-4 border-t">
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDowngradeToFree(user.id)}
                                    >
                                      降级为免费用户
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  第 {page} 页，共 {totalPages} 页
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

