# FlowMoney 部署指南

> 以下以“前端部署 + Supabase 云后台”为目标，推荐 Vercel 托管。如果需要自管服务器，可参考下方 ECS 部署步骤。

## 1. 购买云服务

### 1.1 Vercel（推荐）
1. 访问 [Vercel](https://vercel.com) 注册账号，可直接用 GitHub/GitLab/OAuth 登录。
2. 进入 `Settings > Billing`，选择 Hobby（免费）或 Pro（付费，支持更高并发、自定义缓存策略）。
3. 新建一个 Team（建议使用团队身份，方便后续协作）。

### 1.2 云服务器（ECS / Lightsail 等）
1. 在阿里云、腾讯云或 AWS Lightsail 购买轻量应用服务器，推荐规格：2C4G/40GB SSD，系统选择 Ubuntu 22.04。
2. 绑定公网 IP，开放 80/443 端口。

## 2. 准备仓库与环境

1. 代码已托管至 Git（GitHub/GitLab）。确保 `main` 分支为稳定版本。
2. `.env.local` 中的变量不要提交；在云端通过环境变量配置：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - 若有服务端密钥（如 `SUPABASE_SERVICE_ROLE_KEY`），也需配置。
3. 构建命令：`npm run build -- --webpack`
4. 启动命令：`npm start`

## 3. Vercel 部署流程

1. 在 Vercel Dashboard 选择 `Add New → Project`，授权 Git 仓库。
2. 框架检测自动识别 Next.js，保持默认构建命令（或手动改成 `npm run build -- --webpack`）。
3. 在 “Environment Variables” 中添加所需变量，分别设置 `Production` 与 `Preview`。
4. 点击 `Deploy`，待构建完成后即可获得线上地址。
5. 绑定自定义域名：`Project → Settings → Domains`，按照提示在域名 DNS 服务商处添加 CNAME 记录。
6. 若启用 PWA/Service Worker，无需额外配置，Vercel 会自动处理 HTTPS。

## 4. ECS 部署流程（可选）

1. **安装依赖**
   ```bash
   sudo apt update && sudo apt install -y git curl
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   npm install --global pm2
   ```
2. **拉取代码**
   ```bash
   git clone https://github.com/your-org/flowmoney.git
   cd flowmoney
   npm install
   ```
3. **配置环境变量**
   - 将 `.env.local` 内容写入 `/etc/environment` 或使用 `pm2 start --env production`。
   - 关键项与 Vercel 相同。
4. **构建与启动**
   ```bash
   npm run build -- --webpack
   pm2 start npm --name flowmoney -- start
   pm2 startup systemd
   pm2 save
   ```
5. **反向代理（可选）**
   - 安装 Nginx，配置反向代理到 `127.0.0.1:3000`。
   - 使用 Certbot 为域名签发 TLS。

## 5. Supabase Storage 设置（必须！）

⚠️ **重要**：头像上传功能需要先配置 Supabase Storage，否则会报错 "Bucket not found"

**详细配置步骤请查看**：[`docs/STORAGE_SETUP.md`](./STORAGE_SETUP.md)

**快速步骤**：
1. Supabase Dashboard → Storage → New bucket
2. 创建名为 `user-files` 的 **Public** bucket
3. 在 SQL Editor 中执行 `docs/setup_storage.sql` 设置访问策略
4. 测试头像上传功能

## 6. 部署后检查清单

- [ ] 访问站点，确认 PWA/Service Worker 正常工作（Chrome Lighthouse）。
- [ ] 登录/记账流程与 Supabase API 正常。
- [ ] `TrialReminder` 和 Pro 功能根据环境变量生效。
- [ ] 若使用自定义域，确保 HTTPS 有效。
- [ ] Supabase Storage bucket 已创建并配置正确。
- [ ] 头像上传功能正常工作。

保持该文档更新，便于团队成员快速复现部署过程。***

