# MySQL 迁移指南

本指南帮助你将 FlowMoney 从 Supabase 迁移到自建 MySQL 数据库。

## 前置准备

1. MySQL 数据库服务器 (101.132.118.162:3306)
2. Node.js 和 npm 已安装
3. 项目依赖已安装

## 步骤一：配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
# MySQL 数据库配置
MYSQL_HOST=101.132.118.162
MYSQL_PORT=3306
MYSQL_USER=jizhang
MYSQL_PASSWORD=cjq4399
MYSQL_DATABASE=jizhang

# JWT 密钥（用于 session 认证）
JWT_SECRET=your_very_secure_random_secret_key_here_change_in_production

# 管理员账号配置
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**重要**：在生产环境中，请务必修改 `JWT_SECRET` 和管理员密码！

## 步骤二：创建数据库表

### 方法一：使用 MySQL 客户端

```bash
# 连接到 MySQL 服务器
mysql -h 101.132.118.162 -P 3306 -u jizhang -p jizhang

# 执行建表脚本
source docs/MYSQL_SCHEMA.sql

# 初始化系统分类
source docs/init_categories.sql
```

### 方法二：使用 MySQL Workbench 或其他图形化工具

1. 连接到数据库服务器
2. 打开并执行 `docs/MYSQL_SCHEMA.sql`
3. 打开并执行 `docs/init_categories.sql`

## 步骤三：验证数据库

执行以下 SQL 查询确认表已创建成功：

```sql
SHOW TABLES;

-- 应该看到以下表：
-- users
-- categories
-- ledgers
-- transactions
-- budgets
-- savings_goals
-- admins

-- 验证系统分类已初始化
SELECT * FROM categories WHERE user_id IS NULL;
```

## 步骤四：构建并运行应用

```bash
# 安装依赖（如果还没安装）
npm install

# 开发模式运行
npm run dev

# 或生产构建
npm run build
npm start
```

## 步骤五：测试功能

### 测试用户功能

1. 访问 `http://localhost:3000`
2. 会自动跳转到登录页面
3. 注册一个新账号（使用手机号+密码）
4. 测试记账功能

### 测试管理后台

1. 访问 `http://localhost:3000/admin`
2. 使用管理员账号登录（默认：admin/admin123）
3. 测试以下功能：
   - 用户管理
   - 分类管理
   - 交易记录查看
   - 会员升级

## 主要变更说明

### 认证系统

- **原来**：使用 Supabase Auth（邮箱+密码）
- **现在**：自建认证系统（手机号+密码）+ JWT Session

### 数据库

- **原来**：Supabase PostgreSQL + RLS
- **现在**：自建 MySQL + 应用层权限控制

### 主键类型

- **原来**：UUID
- **现在**：BIGINT AUTO_INCREMENT

### 分类管理

- **原来**：硬编码在前端
- **现在**：存储在数据库中，可通过管理后台管理

## 管理后台功能

访问 `/admin` 路由，使用管理员账号登录后可以：

### 仪表盘
- 查看用户总数、Pro 会员数、免费用户数
- 查看总交易记录数
- 查看最近注册用户

### 用户管理
- 查看所有用户列表
- 搜索用户（按手机号或用户名）
- 升级用户为 Pro 会员（可设置天数）
- 降级用户为免费用户

### 分类管理
- 查看系统分类（收入/支出）
- 新增系统分类
- 编辑系统分类（名称、图标、颜色）
- 删除系统分类（检查是否被使用）

### 交易记录
- 查看最近 100 条交易记录
- 查看用户信息、金额、分类、备注等

## 常见问题

### Q: 无法连接到 MySQL 数据库

A: 请检查：
1. 数据库服务器是否正常运行
2. 防火墙是否开放 3306 端口
3. 用户名密码是否正确
4. `.env.local` 文件配置是否正确

### Q: 登录后提示 Unauthorized

A: 请确认：
1. JWT_SECRET 已正确配置
2. Cookie 能正常设置（检查浏览器开发者工具）
3. 中间件配置正确

### Q: 管理后台无法访问

A: 请确认：
1. ADMIN_USERNAME 和 ADMIN_PASSWORD 已配置
2. 使用正确的管理员账号登录
3. Cookie 正确设置

### Q: 分类显示不正确

A: 请确认：
1. `init_categories.sql` 已执行
2. 数据库中有系统分类数据
3. 前端正确从数据库加载分类

## 数据迁移（可选）

如果需要从 Supabase 迁移现有数据：

1. 从 Supabase 导出数据（CSV 或 SQL）
2. 调整数据格式以匹配新的表结构
3. 导入到 MySQL 数据库

注意：
- UUID 需要转换为 BIGINT
- 邮箱字段改为手机号
- 密码需要重新加密（bcrypt）

## 安全建议

1. **生产环境务必修改默认密码**
2. 使用强 JWT_SECRET（建议 32 位以上随机字符串）
3. 启用 HTTPS
4. 定期备份数据库
5. 限制数据库访问 IP
6. 使用环境变量管理敏感信息
7. 启用 MySQL 慢查询日志监控性能

## 性能优化建议

1. 为常用查询字段添加索引（已在 schema 中包含）
2. 配置 MySQL 连接池大小
3. 启用查询缓存
4. 定期清理过期数据
5. 监控数据库性能指标

## 下一步

- 配置文件上传存储（头像上传功能）
- 添加数据备份策略
- 配置日志系统
- 部署到生产环境

