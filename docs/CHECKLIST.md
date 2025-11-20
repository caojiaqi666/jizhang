# ✅ FlowMoney 移动 APP 部署检查清单

使用本清单确保所有准备工作已完成。

## 📋 开发环境检查

### 必需软件

- [ ] Node.js 18+ 已安装
- [ ] 项目依赖已安装（`npm install`）
- [ ] 应用在浏览器中正常运行（`npm run dev`）

### iOS 开发（仅 macOS）

- [ ] macOS 系统
- [ ] Xcode 14+ 已安装
- [ ] CocoaPods 已安装（`sudo gem install cocoapods`）
- [ ] Apple Developer 账号已注册（$99/年）

### Android 开发

- [ ] Android Studio 已安装
- [ ] Android SDK 已配置
- [ ] Java JDK 17+ 已安装
- [ ] ANDROID_HOME 环境变量已设置

## 🗄️ 后端服务检查

### Supabase 配置

- [ ] Supabase 项目已创建
- [ ] 数据库表已创建（执行 `docs/DB_SCHEMA.sql`）
- [ ] Storage bucket 已创建（执行 `docs/setup_storage.sql`）
- [ ] RLS 策略已配置
- [ ] 环境变量已设置：
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 服务器部署

- [ ] Next.js 应用已部署到 Vercel/服务器
- [ ] 部署的应用可通过 HTTPS 访问
- [ ] 所有功能正常工作（登录、记账、统计等）
- [ ] 获得部署域名（如：`https://flowmoney.vercel.app`）

## 📱 Capacitor 配置

### 基础配置

- [ ] `capacitor.config.ts` 已配置
- [ ] `server.url` 设置为部署的服务器地址
- [ ] `appId` 使用反向域名格式（如：`com.flowmoney.app`）
- [ ] `appName` 已设置

### 图标和资源

- [ ] 应用图标已准备（`resources/icon.png`, 1024x1024）
- [ ] 启动画面已准备（可选）
- [ ] 已运行 `npx capacitor-assets generate`
- [ ] 图标生成成功

## 🔧 原生项目设置

### iOS 项目

- [ ] 运行 `npm run cap:add:ios` 创建 iOS 项目
- [ ] Xcode 项目可正常打开
- [ ] Bundle ID 与 `appId` 一致
- [ ] 签名配置正确（Team 已选择）
- [ ] 权限说明已添加到 `Info.plist`：
  - [ ] 相机权限说明
  - [ ] 相册权限说明
- [ ] 在模拟器/真机上测试通过

### Android 项目

- [ ] 运行 `npm run cap:add:android` 创建 Android 项目
- [ ] Android Studio 项目可正常打开
- [ ] Gradle 同步成功
- [ ] applicationId 与 `appId` 一致
- [ ] 签名密钥已生成（`*.keystore` 文件）
- [ ] `build.gradle` 签名配置完成
- [ ] 在模拟器/真机上测试通过

## 📝 应用商店准备

### 通用资料

- [ ] 应用名称已确定
- [ ] 应用描述已撰写（简短版和完整版）
- [ ] 关键词已准备
- [ ] 应用截图已准备（不同尺寸）
  - [ ] iPhone 6.7" (1290 x 2796)
  - [ ] iPhone 6.5" (1242 x 2688)
  - [ ] Android 手机
  - [ ] Android 平板（可选）
- [ ] 宣传图已准备（可选）
- [ ] 演示视频已录制（可选）

### 法律文档

- [ ] 隐私政策已编写
- [ ] 隐私政策已部署到服务器（可访问的 URL）
- [ ] 用户协议已编写（可选）
- [ ] 支持页面/联系方式已准备

### App Store（iOS）

- [ ] Apple Developer 账号已激活
- [ ] App Store Connect 已登录
- [ ] 应用已在 App Store Connect 创建
- [ ] 测试账号已准备（用于审核）
- [ ] 从 Xcode Archive 并上传成功
- [ ] 构建版本在 App Store Connect 中可见
- [ ] 所有元数据已填写完整
- [ ] 审核说明已撰写

### Google Play（Android）

- [ ] Google Play Console 账号已激活（$25）
- [ ] 应用已在 Console 创建
- [ ] AAB 文件已构建
- [ ] 所有元数据已填写
- [ ] 内容分级问卷已完成
- [ ] 数据安全表单已填写
- [ ] 测试账号已准备（如需要）

### 国内应用市场

- [ ] 确定要上架的市场（华为、小米、OPPO等）
- [ ] 开发者账号已注册
- [ ] 企业资质已准备（如需要）
- [ ] 软件著作权已申请/获得（如需要）
- [ ] ICP 备案已完成（如需要）
- [ ] APK 文件已构建并签名

## 🧪 测试清单

### 功能测试

- [ ] 用户注册/登录
- [ ] 记账功能（添加、编辑、删除）
- [ ] 分类选择
- [ ] 情绪标签选择
- [ ] 统计图表显示
- [ ] 数据导出（Pro 功能）
- [ ] 头像上传（相机/相册）
- [ ] 主题切换
- [ ] 多账本切换（Pro 功能）
- [ ] 存钱罐功能
- [ ] 数据同步

### 界面测试

- [ ] 底部导航栏正常
- [ ] 安全区域适配（刘海屏、底部手势条）
- [ ] 横屏显示正常（如支持）
- [ ] 不同屏幕尺寸显示正常
- [ ] 加载状态显示
- [ ] 错误提示正确

### 性能测试

- [ ] 应用启动速度 < 3秒
- [ ] 页面切换流畅
- [ ] 无明显卡顿
- [ ] 无内存泄漏
- [ ] 网络请求响应正常

### 兼容性测试

- [ ] iOS 14+ 正常运行
- [ ] Android 8+ 正常运行
- [ ] 不同品牌手机测试通过（华为、小米、OPPO等）

## 🚀 发布前最终检查

- [ ] 版本号已更新
  - [ ] `package.json`
  - [ ] iOS: `Info.plist` 或 Xcode General 设置
  - [ ] Android: `build.gradle`
- [ ] 所有 console.log 和调试代码已移除/注释
- [ ] 生产环境配置已启用
- [ ] 隐私政策链接正确可访问
- [ ] 没有使用任何破解或未授权的第三方库
- [ ] 代码已提交到 Git
- [ ] 标签已打上（如：`v1.0.0`）

## 📄 审核资料准备

### App Store

- [ ] 审核说明已撰写（包括测试账号）
- [ ] 所有截图符合要求
- [ ] 元数据无错别字
- [ ] 分级正确
- [ ] Export Compliance 已配置

### Google Play

- [ ] 问卷调查已完成
- [ ] 所有声明已确认
- [ ] 测试人员已添加（如使用内部测试）

## ✨ 可选优化

- [ ] 集成数据分析（Google Analytics/Firebase）
- [ ] 添加崩溃报告（Sentry/Crashlytics）
- [ ] 配置推送通知
- [ ] 添加应用内评分提示
- [ ] 配置深度链接（Deep Links）
- [ ] 添加应用内更新提示
- [ ] 录制宣传视频
- [ ] 准备新闻稿/社交媒体宣传素材

## 🎯 发布后

- [ ] 监控审核状态
- [ ] 准备回复审核问题
- [ ] 审核通过后及时发布
- [ ] 在社交媒体宣传
- [ ] 收集用户反馈
- [ ] 准备第一个更新版本

---

**建议**：打印此清单，逐项检查并打勾，确保不遗漏任何重要步骤！

祝你发布顺利！🎉

