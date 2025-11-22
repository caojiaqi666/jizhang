"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { login, signup, checkUserExists } from "./actions"
import Link from "next/link"
import { PasswordStrength } from "@/components/password-strength"
import { ArrowRight, Loader2 } from "lucide-react"

export function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  
  const [step, setStep] = useState<'phone' | 'password'>('phone')
  const [isNewUser, setIsNewUser] = useState(false)
  
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  
  const [isLoading, setIsLoading] = useState(false)
  const [phoneError, setPhoneError] = useState("")

  const validatePhone = (value: string) => {
    if (!/^1[3-9]\d{9}$/.test(value)) {
      setPhoneError("请输入有效的11位手机号")
      return false
    }
    setPhoneError("")
    return true
  }

  const handleCheckPhone = async () => {
    if (!validatePhone(phone)) return

    setIsLoading(true)
    try {
      const exists = await checkUserExists(phone)
      setIsNewUser(!exists)
      setStep('password')
    } catch (e) {
      toast.error("网络错误，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (password.length < 6) {
      toast.error("密码长度至少6位")
      return
    }
    
    if (isNewUser) {
        // Registration validation
        if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
            toast.error("请设置满足强度的密码")
            return
        }
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("phone", phone)
    formData.append("password", password)

    try {
      const action = isNewUser ? signup : login
      await action(formData)
    } catch (e) {
      // Handle redirect or error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      {/* Phone Input Step */}
      <div className={step === 'phone' ? 'block' : 'hidden'}>
        <div className="space-y-2">
            <Label htmlFor="phone">手机号</Label>
            <Input 
            id="phone" 
            name="phone" 
            type="tel" 
            placeholder="请输入手机号" 
            required 
            autoFocus
            className={phoneError ? "border-destructive bg-input ring-destructive/20" : "bg-input"}
            value={phone}
            onChange={(e) => {
                setPhone(e.target.value)
                if (phoneError) validatePhone(e.target.value)
            }}
            onBlur={() => validatePhone(phone)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    handleCheckPhone()
                }
            }}
            />
            {phoneError && (
            <p className="text-destructive text-xs pl-1">{phoneError}</p>
            )}
        </div>
        <Button 
            type="button"
            onClick={handleCheckPhone} 
            className="w-full mt-6 text-lg font-bold h-14"
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <>
                    继续 <ArrowRight className="ml-2 w-5 h-5" />
                </>
            )}
        </Button>
      </div>

      {/* Password Input Step */}
      <div className={step === 'password' ? 'block animate-in fade-in slide-in-from-right-8 duration-500' : 'hidden'}>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-600 font-medium pl-1">
                    {isNewUser ? "设置密码" : "输入密码"}
                </Label>
                <button 
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-xs text-primary hover:text-primary/80 font-medium"
                >
                    更换手机号
                </button>
            </div>
            
            <div className="bg-secondary/50 p-4 rounded-2xl mb-2 text-sm text-gray-600 border border-border/50">
                {isNewUser ? "👋 欢迎！新用户将自动注册。" : "✨ 欢迎回来！"}
            </div>

            <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder={isNewUser ? "请设置登录密码" : "请输入密码"} 
                required 
                autoFocus={step === 'password'}
                className="bg-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSubmit()
                    }
                }}
            />
            
            {isNewUser && (
                <PasswordStrength password={password} />
            )}

            {!isNewUser && (
                <div className="flex justify-end mt-1">
                    <Link 
                        href="/login/forgot-password"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                        忘记密码？
                    </Link>
                </div>
            )}
        </div>

        {error && (
            <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-2xl mt-4 font-medium">{decodeURIComponent(error)}</div>
        )}

        <Button 
            type="button"
            onClick={handleSubmit} 
            className="w-full mt-6 text-lg font-bold h-14 shadow-lg shadow-primary/20"
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (isNewUser ? "注册并登录" : "登录")}
        </Button>
      </div>
    </form>
  )
}
