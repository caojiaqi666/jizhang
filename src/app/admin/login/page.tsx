import { adminLogin } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">管理后台</CardTitle>
          <CardDescription className="text-base text-gray-600 mt-2">
            FlowMoney Admin Panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input 
                id="username" 
                name="username" 
                type="text" 
                placeholder="请输入管理员用户名" 
                required 
                className="bg-white" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="请输入密码" 
                required 
                className="bg-white" 
              />
            </div>
            {params?.error && (
               <div className="text-red-500 text-sm text-center">{params.error}</div>
            )}
            <div className="pt-4">
              <Button formAction={adminLogin} className="w-full bg-slate-800 hover:bg-slate-900">
                登录
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

