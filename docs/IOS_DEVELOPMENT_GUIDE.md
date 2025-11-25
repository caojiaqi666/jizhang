# FlowMoney iOS 开发与打包指南

本文档详细说明如何启动项目、在 Xcode 中运行调试以及打包 iOS 应用。

---

## 📋 前置要求

### 必需软件
- **macOS**：需要 Mac 电脑
- **Xcode**：从 App Store 下载安装（版本 14.0+）
- **Node.js**：版本 20.x（使用 nvm 管理）
- **CocoaPods**：iOS 依赖管理工具
- **Homebrew**：macOS 包管理器

### 检查环境

```bash
# 检查 Node.js 版本
node -v  # 应显示 v20.x.x

# 检查 npm 版本
npm -v

# 检查 CocoaPods
pod --version

# 检查 Xcode 命令行工具
xcode-select -p  # 应显示 /Applications/Xcode.app/Contents/Developer
```

---

## 🚀 项目启动

### 1. 安装依赖

```bash
# 进入项目目录
cd /Users/jiangan/Documents/workSpace/jizhang

# 安装 Node.js 依赖
npm install

# 安装 iOS 原生依赖
cd ios/App
pod install
cd ../..
```

### 2. 配置环境变量

创建 `.env.local` 文件（如果不存在）：

```bash
# 数据库配置
MYSQL_HOST=your-cloud-host
MYSQL_PORT=3306
MYSQL_USER=your-username
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=jizhang

# 其他配置...
```

### 3. 启动开发服务器

```bash
# 启动 Next.js 开发服务器
npm run dev
```

服务器启动后会显示：
```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

**保持这个终端运行，不要关闭！**

---

## 📱 在 Xcode 中运行

### 方法 1：使用命令行打开（推荐）

```bash
# 同步 Web 资源到 iOS 项目
npx cap sync ios

# 打开 Xcode 项目
npx cap open ios
```

### 方法 2：手动打开

1. 打开 Finder（访达）
2. 进入项目目录：`/Users/jiangan/Documents/workSpace/jizhang/ios/App`
3. **双击打开 `App.xcworkspace`**（注意：是 `.xcworkspace`，不是 `.xcodeproj`）

---

## 🎯 Xcode 使用指南

### 界面说明

```
┌─────────────────────────────────────────────────────────┐
│ [▶️ Play] App > iPhone 16 Pro    [Building...]  [⏹ Stop] │  ← 顶部工具栏
├─────────────────────────────────────────────────────────┤
│ 📁 App        │                                          │
│   └─ App      │         中间编辑区域                      │
│      ├─ 📄    │      (显示代码或配置)                     │
│      └─ 📄    │                                          │
│               │                                          │
│ 左侧导航栏     │                                          │
└─────────────────────────────────────────────────────────┘
```

### 步骤 1：等待索引完成

- Xcode 打开后会显示 "Indexing..." 进度条
- **首次打开需要 1-3 分钟**，请耐心等待
- 索引完成后进度条消失

### 步骤 2：选择模拟器

**找到设备选择器：**
- 位置：Xcode 窗口顶部中间偏左
- 显示为：`App > Generic iOS Device` 或类似文字

**如果看不到设备选择器：**
1. 点击菜单栏 **View** → **Show Toolbar**
2. 或使用菜单栏：**Product** → **Destination** → 选择设备

**选择设备：**
1. 点击设备选择器
2. 在下拉菜单中找到 **iOS Simulators** 分类
3. 选择一款手机：
   - iPhone 16 Pro（推荐，有灵动岛）
   - iPhone 15 Pro
   - iPhone 14
   - 任意其他 iPhone 型号

### 步骤 3：运行应用

**点击运行按钮：**
- 位置：Xcode 窗口左上角
- 图标：黑色三角形 ▶️（Play 按钮）
- 快捷键：`Cmd + R`

**等待构建：**
1. 顶部状态栏显示 "Building App..." 和进度条
2. 首次构建需要 2-5 分钟
3. 如果弹窗要求输入密码（codesign），输入您的电脑密码

**查看运行效果：**
- 构建成功后，会自动弹出 iOS 模拟器窗口
- 模拟器看起来像一部真实的 iPhone
- 您的 App 会自动安装并打开

### 步骤 4：停止运行

- 点击左上角的 **Stop 按钮**（⏹ 方块图标）
- 或按快捷键：`Cmd + .`

---

## 🔧 常见问题

### 1. 模拟器显示白屏或连接错误

**原因**：模拟器无法访问 `localhost:3000`

**解决方法：**

1. 查看电脑的 IP 地址：
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   或在"系统设置" → "网络"中查看（如 `192.168.1.100`）

2. 修改 `capacitor.config.ts`：
   ```typescript
   server: {
     url: 'http://192.168.1.100:3000',  // 替换为您的实际 IP
     cleartext: true,
   }
   ```

3. 重新同步：
   ```bash
   npx cap sync ios
   ```

4. 在 Xcode 中重新运行

### 2. 构建失败：找不到 Pods

**错误信息**：`unable to open configuration settings file`

**解决方法：**

```bash
cd ios/App
pod install
cd ../..
```

然后重新打开 `App.xcworkspace`（不是 `.xcodeproj`）

### 3. 签名错误（Signing）

**错误信息**：`Signing for "App" requires a development team...`

**解决方法：**

1. 在 Xcode 左侧点击 **App** 项目（最顶部的蓝色图标）
2. 选择 **Signing & Capabilities** 标签
3. 勾选 **Automatically manage signing**
4. 选择您的 Apple ID：
   - 如果没有，点击 **Add Account** 添加
   - 使用个人 Apple ID 即可（免费）

### 4. 找不到模拟器列表

**解决方法：**

1. 打开 Xcode 菜单栏：**Xcode** → **Settings** → **Platforms**
2. 确保 **iOS** 平台已下载（可能需要下载几个 GB）
3. 等待下载完成后，模拟器列表会出现

### 5. CocoaPods 安装失败

**使用 Homebrew 安装（推荐）：**

```bash
# 修复 Homebrew 权限
sudo chown -R $(whoami) /opt/homebrew/Cellar

# 安装 CocoaPods
brew install cocoapods
```

**使用 gem 安装：**

```bash
sudo gem install cocoapods
```

---

## 📦 打包 iOS 应用

### 准备工作

1. **Apple Developer 账号**：
   - 个人开发者：$99/年
   - 企业开发者：$299/年
   - 注册地址：https://developer.apple.com

2. **App Store Connect 配置**：
   - 创建 App ID
   - 配置 Bundle Identifier
   - 上传应用图标和截图

### 打包步骤

#### 1. 配置 Release 模式

在 Xcode 中：

1. 点击顶部设备选择器旁边的 **App** scheme
2. 选择 **Edit Scheme...**
3. 左侧选择 **Run**
4. **Build Configuration** 改为 **Release**

#### 2. 选择真机或 Generic iOS Device

1. 点击设备选择器
2. 选择 **Any iOS Device (arm64)** 或连接的真机

#### 3. Archive（归档）

1. 菜单栏：**Product** → **Archive**
2. 等待构建完成（可能需要几分钟）
3. 构建成功后会自动打开 **Organizer** 窗口

#### 4. 上传到 App Store Connect

在 Organizer 窗口中：

1. 选择刚才创建的 Archive
2. 点击 **Distribute App**
3. 选择 **App Store Connect**
4. 点击 **Upload**
5. 按照向导完成上传

#### 5. 在 App Store Connect 中提交审核

1. 访问：https://appstoreconnect.apple.com
2. 进入您的 App
3. 创建新版本
4. 填写版本信息、截图、描述等
5. 选择刚才上传的构建版本
6. 提交审核

### 打包为 IPA 文件（Ad Hoc 分发）

如果需要分发给测试用户：

1. 在 Organizer 中选择 Archive
2. 点击 **Distribute App**
3. 选择 **Ad Hoc**
4. 选择签名证书和描述文件
5. 导出 IPA 文件
6. 通过 TestFlight 或其他方式分发

---

## 🔄 日常开发流程

### 标准工作流

```bash
# 1. 启动开发服务器（终端 1）
npm run dev

# 2. 修改代码后，同步到 iOS（终端 2）
npx cap sync ios

# 3. 在 Xcode 中重新运行（Cmd + R）
```

### 快速调试

```bash
# 查看 iOS 日志
npx cap run ios

# 或者直接在 Xcode 的 Console 中查看日志
```

### 清理缓存

如果遇到奇怪的问题：

```bash
# 清理 Next.js 缓存
rm -rf .next

# 清理 iOS 构建缓存
cd ios/App
rm -rf Pods
pod install
cd ../..

# 在 Xcode 中：Product → Clean Build Folder (Shift + Cmd + K)
```

---

## 📚 相关文档

- [Capacitor iOS 文档](https://capacitorjs.com/docs/ios)
- [Next.js 文档](https://nextjs.org/docs)
- [Apple Developer 文档](https://developer.apple.com/documentation/)
- [App Store 审核指南](https://developer.apple.com/app-store/review/guidelines/)

---

## 💡 最佳实践

1. **始终使用 `.xcworkspace` 打开项目**，不要用 `.xcodeproj`
2. **保持开发服务器运行**，避免模拟器连接失败
3. **定期执行 `npx cap sync ios`**，确保 Web 资源同步
4. **使用 Git 管理代码**，避免丢失修改
5. **测试多种设备**，确保兼容性（iPhone SE、iPhone 16 Pro Max 等）
6. **检查安全区域**，确保内容不被刘海/灵动岛遮挡

---

## 🆘 获取帮助

如果遇到问题：

1. 查看 Xcode Console 中的错误日志
2. 查看终端中 `npm run dev` 的输出
3. 检查 `capacitor.config.ts` 配置
4. 参考本文档的"常见问题"部分
5. 联系项目作者

---

**最后更新**：2025-01-25

