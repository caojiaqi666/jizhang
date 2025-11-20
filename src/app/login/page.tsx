import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const params = await searchParams;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-teal-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">FlowMoney</CardTitle>
          <CardDescription className="text-base text-gray-600 mt-2">
            欢迎回来，今天过得怎么样？
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" required className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input id="password" name="password" type="password" required className="bg-white" />
            </div>
            {params?.error && (
               <div className="text-red-500 text-sm text-center">{params.error}</div>
            )}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button formAction={login} className="w-full bg-teal-600 hover:bg-teal-700">
                登录
              </Button>
              <Button formAction={signup} variant="outline" className="w-full">
                注册
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-400 justify-center">
          每一次记录，都是对生活的治愈
        </CardFooter>
      </Card>
    </div>
  )
}

