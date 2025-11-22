import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from './login-form'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-[24px] flex items-center justify-center mb-4 text-3xl shadow-sm">
            🐱
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 font-brand tracking-wide">FlowMoney</CardTitle>
          <CardDescription className="text-base text-gray-500 mt-2 font-medium">
            记录生活，治愈自己
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Suspense fallback={<div className="text-center text-gray-400 py-8">加载中...</div>}>
            <LoginForm />
          </Suspense>
        </CardContent>
        <CardFooter className="text-center text-xs text-gray-400 justify-center pb-8">
          FlowMoney © 2024
        </CardFooter>
      </Card>
    </div>
  )
}
