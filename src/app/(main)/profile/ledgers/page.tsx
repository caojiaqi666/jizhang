"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, Trash2, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createLedger, deleteLedger, updateLedger, Ledger } from "@/app/actions/ledgers"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useMembership } from "@/components/membership-provider"
import { ProFeatureWall } from "@/components/pro-feature-wall"
import { useLedger } from "@/components/ledger-provider"

export default function LedgersPage() {
  const router = useRouter()
  // Use global ledger context instead of local state
  const { ledgers, refreshLedgers } = useLedger()
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const { isPro, loading: membershipLoading } = useMembership()

  const handleCreate = async () => {
      if (!isPro) {
          toast.error("多账本管理为 Pro 专享")
          router.push("/profile/pro")
          return
      }
      if (!newName.trim()) return
      try {
          await createLedger(newName)
          toast.success("账本创建成功")
          setIsCreateOpen(false)
          setNewName("")
          await refreshLedgers() // Refresh global context
      } catch (e) {
          const message = e instanceof Error ? e.message : "创建失败"
          toast.error(message)
      }
  }

  const handleDelete = async (id: string) => {
      if (!isPro) {
          toast.error("多账本管理为 Pro 专享")
          router.push("/profile/pro")
          return
      }
      if (confirm("确定要删除该账本吗？账本内的记录也将被删除（或变为孤儿数据）。")) {
          try {
              await deleteLedger(id)
              toast.success("已删除")
              await refreshLedgers() // Refresh global context
          } catch (e) {
              const message = e instanceof Error ? e.message : "删除失败"
              toast.error(message)
          }
      }
  }

  const startEdit = (l: Ledger) => {
      setEditingId(l.id)
      setEditName(l.name)
  }

  const saveEdit = async (id: string) => {
      if (!isPro) {
          toast.error("多账本管理为 Pro 专享")
          router.push("/profile/pro")
          return
      }
      try {
          await updateLedger(id, editName)
          toast.success("更新成功")
          setEditingId(null)
          await refreshLedgers() // Refresh global context
      } catch (e) {
          const message = e instanceof Error ? e.message : "更新失败"
          toast.error(message)
      }
  }

  return (
    <div className="p-4 pb-24 bg-gray-50 min-h-screen pt-[calc(1rem+env(safe-area-inset-top))]">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-lg font-bold text-gray-900">账本管理</h1>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs">
                    <Plus className="w-4 h-4 mr-1" /> 新建
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>新建账本</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Input 
                        placeholder="账本名称（如：装修、旅行）" 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <Button className="w-full bg-teal-600" onClick={handleCreate}>确认创建</Button>
                </div>
            </DialogContent>
        </Dialog>
      </header>

      {membershipLoading ? (
        <div className="text-center text-gray-400 text-sm py-8">加载中...</div>
      ) : !isPro ? (
        <ProFeatureWall
          title="多账本管理为 Pro 专享"
          description="一个帐号管理家庭账本、旅行账本与副业账本。解锁后可无限新增、编辑与切换。"
          highlight="Pro 会员可云端自动备份所有账本"
        />
      ) : (
      <div className="space-y-3">
        {/* Use global ledgers state directly */}
        {ledgers.map((ledger) => (
            <div key={ledger.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                {editingId === ledger.id ? (
                    <div className="flex items-center gap-2 flex-1 mr-2">
                        <Input 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 text-sm" 
                        />
                        <Button size="icon" className="h-8 w-8 bg-green-500 hover:bg-green-600" onClick={() => saveEdit(ledger.id)}>
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white",
                            ledger.is_default ? "bg-teal-500" : "bg-indigo-500"
                        )}>
                            {ledger.name[0]}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                                {ledger.name}
                                {ledger.is_default && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">默认</span>}
                            </div>
                            <div className="text-xs text-gray-400">
                                创建于 {new Date(ledger.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                )}

                {!editingId && (
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-teal-600" onClick={() => startEdit(ledger)}>
                            <Edit2 className="w-4 h-4" />
                        </Button>
                        {!ledger.is_default && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => handleDelete(ledger.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        ))}
      </div>
      )}
    </div>
  )
}
