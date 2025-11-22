'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { checkPhone, resetPassword } from './actions'
import { ChevronLeft } from 'lucide-react'
import { PasswordStrength } from '@/components/password-strength'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'reset'>('phone')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckPhone = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toast.error('请输入有效的手机号')
      return
    }

    setIsLoading(true)
    try {
      const result = await checkPhone(phone)
      if (!result.success) {
        toast.error(result.message)
        return
      }
      
      setStep('reset')
    } catch (error) {
      toast.error('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    if (password.length < 8) {
      toast.error('密码长度至少8位')
      return
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        toast.error('密码需包含字母和数字')
        return
    }
    if (password !== confirmPassword) {
      toast.error('两次输入的密码不一致')
      return
    }

    setIsLoading(true)
    try {
      const result = await resetPassword(phone, password)
      if (result.success) {
        toast.success('密码重置成功，请登录')
        router.push('/login')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('重置失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-teal-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="text-center relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-4 top-4"
            onClick={() => router.push('/login')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <CardTitle className="text-xl font-bold text-gray-800">重置密码</CardTitle>
          <CardDescription>
            {step === 'phone' ? '验证手机号以重置密码' : '设置新密码'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {step === 'phone' && (
                <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="请输入注册手机号" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white"
                />
                </div>
            )}

            {step === 'reset' && (
              <>
                <div className="p-3 bg-yellow-50 text-yellow-700 text-xs rounded-md mb-4">
                    演示模式：已跳过短信验证码步骤
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">新密码</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="至少8位，包含字母和数字" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white"
                  />
                  <PasswordStrength password={password} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认新密码</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="再次输入新密码" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </>
            )}

            <Button 
              className="w-full bg-teal-600 hover:bg-teal-700 mt-4"
              onClick={step === 'phone' ? handleCheckPhone : handleReset}
              disabled={isLoading}
            >
              {isLoading ? '处理中...' : (step === 'phone' ? '下一步' : '重置密码')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
