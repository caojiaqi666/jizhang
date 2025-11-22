'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getSystemCategories, createSystemCategory, updateSystemCategory, deleteSystemCategory } from '../actions'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const ICON_OPTIONS = [
  { id: 'food', name: '餐饮', emoji: '🍚' },
  { id: 'transport', name: '交通', emoji: '🚌' },
  { id: 'shopping', name: '购物', emoji: '🛍️' },
  { id: 'entertainment', name: '娱乐', emoji: '🎬' },
  { id: 'health', name: '医疗', emoji: '❤️' },
  { id: 'housing', name: '居住', emoji: '🏠' },
  { id: 'education', name: '学习', emoji: '📚' },
  { id: 'fitness', name: '运动', emoji: '💪' },
  { id: 'salary', name: '工资', emoji: '💼' },
  { id: 'bonus', name: '奖金', emoji: '🎁' },
  { id: 'travel', name: '旅行', emoji: '✈️' },
  { id: 'other', name: '其他', emoji: '❓' },
]

const COLOR_OPTIONS = [
  'bg-orange-100 text-orange-600',
  'bg-blue-100 text-blue-600',
  'bg-pink-100 text-pink-600',
  'bg-purple-100 text-purple-600',
  'bg-red-100 text-red-600',
  'bg-indigo-100 text-indigo-600',
  'bg-yellow-100 text-yellow-600',
  'bg-green-100 text-green-600',
  'bg-teal-100 text-teal-600',
  'bg-amber-100 text-amber-600',
  'bg-sky-100 text-sky-600',
  'bg-gray-100 text-gray-600',
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    icon: 'food',
    type: 'expense' as 'income' | 'expense',
    color: COLOR_OPTIONS[0]
  })

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const result = await getSystemCategories()
      setCategories(result)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await updateSystemCategory(
          editingCategory.id,
          formData.name,
          formData.icon,
          formData.color
        )
        alert('更新成功！')
      } else {
        await createSystemCategory(
          formData.name,
          formData.icon,
          formData.type,
          formData.color
        )
        alert('创建成功！')
      }
      setDialogOpen(false)
      resetForm()
      fetchCategories()
    } catch (error) {
      alert('操作失败：' + (error as any).message)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个分类吗？')) return
    
    try {
      const result = await deleteSystemCategory(id)
      if (result.success) {
        alert('删除成功！')
        fetchCategories()
      } else {
        alert('删除失败：' + result.error)
      }
    } catch (error) {
      alert('删除失败：' + (error as any).message)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      icon: 'food',
      type: 'expense',
      color: COLOR_OPTIONS[0]
    })
    setEditingCategory(null)
  }

  const openEditDialog = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      icon: category.icon,
      type: category.type,
      color: category.color || COLOR_OPTIONS[0]
    })
    setDialogOpen(true)
  }

  const openCreateDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  const expenseCategories = categories.filter(c => c.type === 'expense')
  const incomeCategories = categories.filter(c => c.type === 'income')

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">分类管理</h1>
          <p className="text-gray-600 mt-2">管理系统默认分类</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              新增分类
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? '编辑分类' : '新增分类'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>分类名称</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：餐饮"
                />
              </div>

              <div className="space-y-2">
                <Label>图标</Label>
                <Select value={formData.icon} onValueChange={(v) => setFormData({ ...formData, icon: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((icon) => (
                      <SelectItem key={icon.id} value={icon.id}>
                        {icon.emoji} {icon.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!editingCategory && (
                <div className="space-y-2">
                  <Label>类型</Label>
                  <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">支出</SelectItem>
                      <SelectItem value="income">收入</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>颜色</Label>
                <div className="grid grid-cols-6 gap-2">
                  {COLOR_OPTIONS.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg ${color} ${
                        formData.color === color ? 'ring-2 ring-offset-2 ring-teal-500' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full">
                {editingCategory ? '更新' : '创建'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">加载中...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Categories */}
          <Card>
            <CardHeader>
              <CardTitle>支出分类</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenseCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
                        {ICON_OPTIONS.find(i => i.id === category.icon)?.emoji || '❓'}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Income Categories */}
          <Card>
            <CardHeader>
              <CardTitle>收入分类</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incomeCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
                        {ICON_OPTIONS.find(i => i.id === category.icon)?.emoji || '❓'}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

