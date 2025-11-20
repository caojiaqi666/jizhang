# 📱 FlowMoney 移动 APP 打包指南

> 本指南将帮助你把 FlowMoney 打包成 iOS 和 Android 应用

## 🎯 架构说明

FlowMoney 采用 **Hybrid App** 架构：
- **前端**：使用 Capacitor 将 Web 应用封装为原生 APP
- **后端**：Next.js 应用部署在云端（Vercel/自建服务器）
- **通信**：APP 通过 HTTPS 请求访问服务器 API

这种架构的优势：
- ✅ 代码统一，一次开发，多端运行
- ✅ 更新灵活，服务器端更新即时生效
- ✅ 功能完整，Server Actions 正常工作
- ✅ 开发简单，无需重构现有代码

## 📋 前置要求

### 必需软件

**macOS（推荐，用于 iOS 开发）：**
- Node.js 18+ 
- Xcode 14+（仅 iOS）
- Android Studio（仅 Android）
- CocoaPods（iOS 依赖管理）：`sudo gem install cocoapods`

**Windows/Linux（仅 Android）：**
- Node.js 18+
- Android Studio
- Java JDK 17+

### 开发者账号（上架必需）

- **Apple Developer Program**：$99/年（iOS 上架必需）
- **Google Play Console**：一次性 $25（Android 上架必需）

## 🚀 快速开始

### 步骤 1：部署后端服务器

在打包 APP 之前，**必须先部署 Next.js 应用**：

#### 方案 A：部署到 Vercel（推荐）

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=你的supabase地址
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的supabase密钥
   ```
4. 部署完成后获得域名，如：`https://flowmoney.vercel.app`

#### 方案 B：自建服务器

参考 [`DEPLOY.md`](./DEPLOY.md) 中的 ECS 部署流程。

### 步骤 2：配置 Capacitor

编辑 `capacitor.config.ts`：

```typescript
const config: CapacitorConfig = {
  appId: 'com.flowmoney.app', // 修改为你的 APP ID
  appName: 'FlowMoney',        // 修改为你的 APP 名称
  webDir: 'out',
  server: {
    // ⚠️ 重要：设置为你的服务器地址
    url: 'https://flowmoney.vercel.app', // 替换为实际域名
    cleartext: false, // 生产环境必须使用 HTTPS
  },
  // ... 其他配置
}
```

**注意**：
- `appId` 格式：`com.公司名.应用名`（反向域名格式）
- `url` 必须是已部署的服务器地址
- 确保服务器支持 HTTPS

### 步骤 3：准备 APP 图标

在项目根目录创建 `resources/` 文件夹，放入以下文件：

```
resources/
  ├── icon.png       # 1024x1024，PNG，应用图标
  └── splash.png     # 2732x2732，PNG，启动画面（可选）
```

**图标设计要求**：
- 尺寸：1024x1024 像素
- 格式：PNG（透明背景或纯色背景）
- 内容：中心 70% 区域是主要内容（避免被圆角裁切）

**生成各平台图标**：

```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate
```

这会自动生成 iOS 和 Android 所需的所有尺寸图标。

### 步骤 4：初始化原生项目

```bash
# 添加 iOS 平台（仅 macOS）
npm run cap:add:ios

# 添加 Android 平台
npm run cap:add:android

# 同步代码到原生项目
npm run cap:sync
```

## 📱 iOS 构建

### 前置要求

1. **安装 Xcode**（从 Mac App Store）
2. **安装 CocoaPods**：
   ```bash
   sudo gem install cocoapods
   ```
3. **Apple Developer 账号**（上架必需）

### 构建步骤

1. **打开 Xcode 项目**：
   ```bash
   npm run cap:open:ios
   ```

2. **配置项目**：
   - 选择 `App` target
   - General 标签：
     - **Display Name**：FlowMoney
     - **Bundle Identifier**：com.flowmoney.app（与 capacitor.config.ts 一致）
     - **Version**：1.0.0
     - **Build**：1
   - Signing & Capabilities：
     - **Team**：选择你的 Apple Developer Team
     - **Signing Certificate**：自动管理

3. **测试运行**：
   - 选择模拟器或真机
   - 点击运行按钮 (⌘R)
   - APP 应该能正常打开并加载服务器内容

4. **打包上架**：
   - 菜单：Product → Archive
   - 等待构建完成
   - 在 Organizer 窗口选择 "Distribute App"
   - 选择 "App Store Connect"
   - 按照向导完成上传

### 常见问题

**Q: Signing 报错？**
- 确保已登录 Apple Developer 账号
- 在 Preferences → Accounts 中添加账号

**Q: Archive 失败？**
- 将 scheme 改为 Release 模式
- Clean Build Folder (⌘⇧K)

**Q: 真机运行闪退？**
- 检查 capacitor.config.ts 中的 server.url 是否正确
- 确保服务器可访问

## 🤖 Android 构建

### 前置要求

1. **安装 Android Studio**
2. **安装 Android SDK**（通过 Android Studio）
3. **配置环境变量**：
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
   export ANDROID_HOME=$HOME/Android/Sdk          # Linux
   # Windows: 设置系统环境变量
   ```

### 构建步骤

1. **打开 Android Studio**：
   ```bash
   npm run cap:open:android
   ```

2. **配置项目**：
   - 等待 Gradle 同步完成
   - 文件：`android/app/build.gradle`
     ```gradle
     android {
         defaultConfig {
             applicationId "com.flowmoney.app"  // 与 capacitor.config.ts 一致
             versionCode 1
             versionName "1.0.0"
         }
     }
     ```

3. **生成签名密钥**（首次构建）：
   ```bash
   keytool -genkey -v -keystore flowmoney-release.keystore \
     -alias flowmoney -keyalg RSA -keysize 2048 -validity 10000
   ```
   
   妥善保管：
   - `flowmoney-release.keystore` 文件
   - 密钥库密码
   - 密钥别名和密码

4. **配置签名**：
   
   编辑 `android/app/build.gradle`：
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file('../flowmoney-release.keystore')
               storePassword 'your-store-password'
               keyAlias 'flowmoney'
               keyPassword 'your-key-password'
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled false
               proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

5. **构建 APK**：
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   
   生成的 APK 位置：
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

6. **构建 AAB**（上架 Google Play 必需）：
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   
   生成的 AAB 位置：
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```

### 常见问题

**Q: Gradle 同步失败？**
- 检查网络连接
- 尝试使用国内镜像：修改 `android/build.gradle`
  ```gradle
  repositories {
      maven { url 'https://maven.aliyun.com/repository/public/' }
      google()
      mavenCentral()
  }
  ```

**Q: 签名错误？**
- 检查密钥库路径和密码
- 确保 .keystore 文件在正确位置

**Q: APP 闪退？**
- 检查 capacitor.config.ts 中的 server.url
- 查看 Android Studio 的 Logcat 日志

## 🧪 测试

### 本地测试

**iOS**：
```bash
npm run ios
```

**Android**：
```bash
npm run android
```

### 真机测试

**iOS**：
1. 连接 iPhone 到 Mac
2. 在 Xcode 中选择设备
3. 点击运行
4. 首次需要在 iPhone 设置中信任开发者

**Android**：
1. 启用开发者选项和 USB 调试
2. 连接设备
3. 在 Android Studio 中选择设备
4. 点击运行

### 功能检查清单

- [ ] 登录/注册流程
- [ ] 记账功能（添加、编辑、删除）
- [ ] 统计图表显示
- [ ] 头像上传（调用相机）
- [ ] 数据同步（与服务器）
- [ ] 主题切换
- [ ] 底部导航栏显示正常
- [ ] 安全区域适配（刘海屏、底部手势条）
- [ ] 推送通知（如已实现）

## 🔄 版本更新

### 更新 Web 内容

由于采用 Hybrid 模式，大部分更新只需：
1. 更新服务器代码
2. 重新部署到 Vercel/服务器
3. 用户下次打开 APP 自动获取最新内容

无需重新提交 APP！✅

### 何时需要重新提交 APP

以下情况需要重新打包并提交：
- 修改 APP 名称、图标
- 升级 Capacitor 或添加新插件
- 修改权限配置
- 重大功能更新（建议重新提交以更新应用商店描述）

### 版本号管理

更新版本号时，需要同时修改：

1. `package.json`：
   ```json
   {
     "version": "1.0.1"
   }
   ```

2. `ios/App/App.xcodeproj`（Xcode）：
   - Version: 1.0.1
   - Build: 2（递增）

3. `android/app/build.gradle`：
   ```gradle
   defaultConfig {
       versionCode 2         // 递增整数
       versionName "1.0.1"
   }
   ```

## 📝 相关文档

- [App Store 上架指南](./APP_STORE_GUIDE.md)
- [Google Play 上架指南](./GOOGLE_PLAY_GUIDE.md)
- [国内应用市场上架](./CHINA_APP_STORES.md)
- [通知功能实现](./NOTIFICATIONS.md)

## 🆘 获取帮助

遇到问题？
1. 查看 Capacitor 官方文档：https://capacitorjs.com/docs
2. 查看本项目 GitHub Issues
3. 联系作者

---

祝你打包顺利！🎉

