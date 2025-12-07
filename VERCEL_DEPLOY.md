# Vercel 一键部署指南

> 完全免费，3分钟完成部署

## 🚀 方法一：GitHub 集成（推荐）

### 1. 推送代码到 GitHub

```bash
# 初始化 git（如果还没有）
git init
git add .
git commit -m "Initial commit with PWA support"

# 在 GitHub 创建新仓库，然后：
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 2. 在 Vercel 导入项目

1. 访问 https://vercel.com
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 授权访问 GitHub
5. 选择你的仓库
6. 点击 "Import"

### 3. 配置环境变量

在 Vercel 项目设置中添加：

```
DATABASE_URL=你的MySQL连接字符串
JWT_SECRET=随机生成的长字符串
NEXT_PUBLIC_APP_URL=https://你的域名.vercel.app
```

### 4. 部署

点击 "Deploy"，等待 2-3 分钟即可完成！

## 🎯 方法二：Vercel CLI

### 1. 安装 CLI

```bash
npm install -g vercel
```

### 2. 登录

```bash
vercel login
```

### 3. 部署

```bash
# 首次部署（会提示设置项目）
vercel

# 生产环境部署
vercel --prod
```

### 4. 配置环境变量

```bash
# 添加环境变量
vercel env add DATABASE_URL
vercel env add JWT_SECRET

# 或者在 Web 界面配置
```

## ⚙️ Vercel 配置文件

创建 `vercel.json`（可选，已有默认配置）：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 🌏 自定义域名（可选）

### 使用 Vercel 子域名（免费）

Vercel 会自动分配: `your-project.vercel.app`

### 使用自己的域名

1. 在 Vercel 项目设置中点击 "Domains"
2. 输入你的域名（如 `jizhang.yourdomain.com`）
3. 按照提示配置 DNS：

```
类型    名称                值
CNAME   jizhang             cname.vercel-dns.com
```

4. 等待 DNS 生效（通常几分钟）

## 📊 Vercel 免费额度

✅ **完全够用！**

- ✅ 100GB 带宽/月
- ✅ 无限部署次数
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动备份
- ✅ 即时回滚

对于个人项目和中小型应用完全足够！

## 🔄 自动部署

配置好 GitHub 集成后：

```bash
# 每次提交代码
git add .
git commit -m "Update features"
git push

# Vercel 会自动：
# 1. 检测到代码变更
# 2. 运行构建
# 3. 部署到生产环境
# 4. 发送部署通知
```

## 🐛 调试技巧

### 查看构建日志

1. 在 Vercel 项目页面
2. 点击最新的部署
3. 查看 "Build Logs"

### 查看运行时日志

1. 项目设置 → Functions
2. 查看 Realtime Logs
3. 或使用 CLI：`vercel logs`

### 本地预览生产构建

```bash
# 本地构建
npm run build

# 本地运行生产版本
npm start

# 在 http://localhost:3000 测试
```

## 🔐 环境变量管理

### 开发环境

创建 `.env.local`：

```env
DATABASE_URL=你的本地数据库
JWT_SECRET=本地测试密钥
```

### 生产环境

在 Vercel 设置中添加，或使用 CLI：

```bash
# 添加生产环境变量
vercel env add DATABASE_URL production

# 添加所有环境变量
vercel env add DATABASE_URL production preview development

# 查看环境变量
vercel env ls
```

## 📱 PWA 特殊配置

Vercel 已经完美支持 PWA，无需额外配置！

自动包含：
- ✅ HTTPS（必需）
- ✅ Service Worker 支持
- ✅ 正确的 MIME 类型
- ✅ 缓存头配置

## 🎯 部署检查清单

部署前确认：

- [ ] 所有代码已提交到 Git
- [ ] 环境变量已配置
- [ ] `npm run build` 本地测试通过
- [ ] 图标文件已准备好
- [ ] manifest.json 信息正确

部署后测试：

- [ ] 网站能正常访问
- [ ] HTTPS 正常工作
- [ ] 登录功能正常
- [ ] 数据库连接正常
- [ ] PWA 安装功能正常
- [ ] Service Worker 激活

## 🚀 性能优化

Vercel 自动优化：
- ✅ 图片优化（Next.js Image）
- ✅ 代码分割
- ✅ 压缩静态资源
- ✅ Edge 缓存
- ✅ Brotli 压缩

额外优化：

```bash
# 分析包大小
npm run build -- --analyze

# 使用 Vercel Analytics（免费）
npm install @vercel/analytics
```

然后在 `app/layout.tsx` 添加：

```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🆘 常见问题

### Q: 构建失败怎么办？

1. 检查 Build Logs 中的错误
2. 确保 `npm run build` 在本地能成功
3. 检查环境变量是否配置正确
4. 检查 Node 版本是否兼容

### Q: Service Worker 404 错误

这是正常的！首次访问时 Service Worker 还未安装。刷新页面即可。

### Q: 数据库连接失败

1. 检查 DATABASE_URL 是否正确
2. 确保数据库允许 Vercel 的 IP 访问
3. 考虑使用 Serverless 数据库（如 PlanetScale）

### Q: 如何回滚到上一个版本？

1. 在 Vercel 项目页面
2. 找到之前的部署
3. 点击 "..." → "Promote to Production"

## 📚 更多资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel CLI 文档](https://vercel.com/docs/cli)

---

**准备好了吗？开始部署！** 🚀

```bash
# 一键部署
git push && vercel --prod
```

**第一次部署预计时间：3-5 分钟** ⏱️

部署成功后，你会得到一个 `https://your-app.vercel.app` 的网址，可以立即分享给用户！




