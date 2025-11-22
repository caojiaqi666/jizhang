# FlowMoney - MySQL 版本

个人记账应用，基于 Next.js 16 + MySQL 开发。

## 🌟 特性

- ✅ 手机号+密码注册/登录
- ✅ 收支记账，支持分类和情绪标记
- ✅ 多账本管理（Pro 会员功能）
- ✅ 数据可视化统计
- ✅ 储蓄目标设置
- ✅ 数据导出
- ✅ 完整的管理后台
- ✅ 7天免费试用

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository>
cd jizhang
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
# MySQL 数据库配置
MYSQL_HOST=101.132.118.162
MYSQL_PORT=3306
MYSQL_USER=jizhang
MYSQL_PASSWORD=cjq4399
MYSQL_DATABASE=jizhang

# JWT 密钥（生产环境请修改为强随机密钥）
JWT_SECRET=your_very_secure_random_secret_key_change_in_production

# 管理员账号（生产环境请修改密码）
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 4. 初始化数据库

确保 MySQL 数据库可访问，然后执行：

```bash
# 创建表结构
mysql -h 101.132.118.162 -P 3306 -u jizhang -p jizhang < docs/MYSQL_SCHEMA.sql

# 初始化系统分类
mysql -h 101.132.118.162 -P 3306 -u jizhang -p jizhang < docs/init_categories.sql
```

### 5. 启动应用

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
npm start
```

访问 http://localhost:3000

## 📱 使用指南

### 用户端

1. 访问首页会自动跳转到登录页面
2. 注册账号（手机号+密码，手机号格式：13xxxxxxxxx）
3. 登录后自动获得 7 天 Pro 会员试用
4. 开始记账！

### 管理后台

1. 访问 http://localhost:3000/admin
2. 使用管理员账号登录（默认：admin/admin123）
3. 管理功能：
   - 📊 仪表盘 - 查看系统统计数据
   - 👥 用户管理 - 搜索用户、升级会员、设置试用期
   - 📁 分类管理 - 新增、编辑、删除系统分类
   - 💳 交易记录 - 查看所有用户的交易记录

## 🏗️ 技术架构

### 前端
- **框架**: Next.js 16 (App Router)
- **UI 框架**: React 19
- **样式**: TailwindCSS 4
- **组件库**: shadcn/ui + Radix UI
- **图表**: Recharts
- **日期处理**: date-fns

### 后端
- **框架**: Next.js Server Actions
- **数据库**: MySQL
- **ORM**: 原生 SQL (mysql2)
- **认证**: JWT + bcrypt
- **Session**: Cookie-based

### 数据库表结构

- `users` - 用户表（手机号、密码、会员信息）
- `categories` - 分类表（系统分类 + 用户自定义）
- `ledgers` - 账本表
- `transactions` - 交易记录表
- `budgets` - 预算表
- `savings_goals` - 储蓄目标表
- `admins` - 管理员表

## 📂 项目结构

```
src/
├── app/
│   ├── (main)/              # 用户端页面
│   │   ├── discovery/       # 发现页
│   │   ├── page.tsx         # 首页（记账）
│   │   ├── profile/         # 个人中心
│   │   └── stats/           # 统计
│   ├── admin/               # 管理后台
│   │   ├── dashboard/       # 仪表盘
│   │   ├── users/           # 用户管理
│   │   ├── categories/      # 分类管理
│   │   ├── transactions/    # 交易记录
│   │   └── login/           # 管理员登录
│   ├── actions/             # Server Actions
│   │   ├── finance.ts       # 记账相关
│   │   ├── ledgers.ts       # 账本相关
│   │   ├── user.ts          # 用户相关
│   │   └── export.ts        # 导出相关
│   └── login/               # 用户登录
├── components/              # React 组件
│   ├── ui/                  # UI 基础组件
│   ├── charts/              # 图表组件
│   └── ...                  # 业务组件
├── utils/
│   ├── auth/               # 认证工具
│   │   ├── session.ts      # Session 管理
│   │   └── password.ts     # 密码加密
│   └── mysql/              # 数据库操作
│       ├── connection.ts   # 连接池
│       ├── client.ts       # 查询封装
│       ├── user.ts         # 用户操作
│       ├── category.ts     # 分类操作
│       ├── ledger.ts       # 账本操作
│       ├── transaction.ts  # 交易操作
│       └── auth.ts         # 认证操作
└── middleware.ts           # 路由保护中间件
```

## 🎯 核心功能

### 记账功能
- 支出/收入记录
- 分类选择（系统分类 + 自定义分类）
- 情绪标记（开心、平静、悲伤等）
- 备注说明
- 多账本支持（Pro 功能）

### 统计分析
- 按周/月/年统计
- 分类占比分析
- 情绪分析
- 收支趋势图表

### 会员系统
- 7 天免费试用
- Pro 会员功能：
  - 多账本管理
  - 高级统计
  - 数据导出

### 管理后台
- 用户管理（搜索、升级会员）
- 分类管理（CRUD）
- 交易记录查看
- 数据统计仪表盘

## 🔐 安全性

- ✅ 密码 bcrypt 加密
- ✅ JWT Session 认证
- ✅ HttpOnly Cookie
- ✅ SQL 参数化查询（防注入）
- ✅ 中间件路由保护
- ✅ 会员权限验证

## 📝 API 接口

### 用户认证
- `POST /login` - 用户登录
- `POST /signup` - 用户注册

### 记账相关
- `getDashboardData()` - 获取首页数据
- `getStatsData()` - 获取统计数据
- `getAllTransactionsForExport()` - 导出数据

### 账本管理
- `getLedgers()` - 获取账本列表
- `createLedger()` - 创建账本（Pro）
- `updateLedger()` - 更新账本（Pro）
- `deleteLedger()` - 删除账本（Pro）

### 用户管理
- `getUserProfile()` - 获取用户信息
- `updateSavingsSettings()` - 更新储蓄设置
- `upgradeToPro()` - 升级 Pro

### 管理后台
- `adminLogin()` - 管理员登录
- `getUsers()` - 获取用户列表
- `updateUserMembershipAction()` - 更新会员状态
- `getSystemCategories()` - 获取系统分类
- `createSystemCategory()` - 创建分类
- `updateSystemCategory()` - 更新分类
- `deleteSystemCategory()` - 删除分类

## 🔧 开发

### 运行测试

```bash
npm test
```

### 代码检查

```bash
npm run lint
```

### 类型检查

```bash
npm run type-check
```

## 📚 文档

- [MySQL 迁移指南](docs/MYSQL_MIGRATION_GUIDE.md)
- [快速启动指南](QUICK_START.md)
- [实施总结](IMPLEMENTATION_SUMMARY.md)
- [数据库表结构](docs/MYSQL_SCHEMA.sql)

## ⚠️ 注意事项

### 生产环境部署前

1. **必须修改的配置**：
   - `JWT_SECRET` - 使用强随机密钥
   - `ADMIN_PASSWORD` - 修改管理员密码

2. **数据库安全**：
   - 限制数据库访问 IP
   - 使用防火墙保护 3306 端口
   - 定期备份数据

3. **应用安全**：
   - 启用 HTTPS
   - 配置 CORS
   - 设置 rate limiting

## 🐛 故障排除

### 无法连接数据库

- 检查 MySQL 服务器状态
- 检查防火墙配置
- 验证 `.env.local` 配置
- 测试网络连通性：`telnet 101.132.118.162 3306`

### 登录后跳转到登录页

- 检查 `JWT_SECRET` 是否配置
- 清除浏览器 Cookie
- 检查控制台错误信息

### 管理后台无法访问

- 确认管理员账号密码正确
- 访问 `/admin/login` 重新登录
- 检查 Cookie 是否被阻止

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License

## 👨‍💻 作者

FlowMoney Team

---

**版本**: 2.0.0 (MySQL Version)  
**更新日期**: 2024-11-21

