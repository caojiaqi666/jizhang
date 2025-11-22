// 临时测试脚本 - 验证环境变量
// 使用方式: node -r dotenv/config test-env.js dotenv_config_path=.env.local
// 或者在 Next.js 项目中，环境变量会自动加载

const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '.env.local')

console.log('检查环境变量文件...\n')

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local 文件存在')
  console.log('文件路径:', envPath)
  console.log('\n文件内容预览（敏感信息已隐藏）:')
  const content = fs.readFileSync(envPath, 'utf8')
  const lines = content.split('\n')
  lines.forEach(line => {
    if (line.trim() && !line.trim().startsWith('#')) {
      const [key] = line.split('=')
      console.log(`  ${key}=***`)
    } else if (line.trim().startsWith('#')) {
      console.log(`  ${line}`)
    }
  })
} else {
  console.log('❌ .env.local 文件不存在！')
  console.log('请在项目根目录创建 .env.local 文件')
  console.log('\n可以使用以下命令创建：')
  console.log('  cp env.example .env.local')
  process.exit(1)
}

console.log('\n\n📝 重要提示：')
console.log('1. 创建或修改 .env.local 后，必须重启 Next.js 开发服务器')
console.log('2. 使用 Ctrl+C 停止服务器，然后运行 npm run dev 重新启动')
console.log('3. 环境变量只在服务器端可用，客户端需要使用 NEXT_PUBLIC_ 前缀')

