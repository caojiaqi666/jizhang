# 🚀 移动 APP 快速开始指南

> 5分钟了解如何将 FlowMoney 打包成移动应用

## 📱 什么是 Capacitor？

Capacitor 是一个跨平台原生运行时，可以将你的 Web 应用（Next.js）封装成 iOS 和 Android APP。

**优势**：
- ✅ 无需重写代码
- ✅ 保持 Web 和 APP 功能一致
- ✅ 支持调用原生功能（相机、通知等）
- ✅ 更新灵活（服务器端更新即时生效）

## 🎯 架构原理

```
┌─────────────────────────────────────┐
│         FlowMoney APP (iOS/Android) │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   WebView (显示 Web 内容)   │   │
│  │                              │   │
│  │  ↓ HTTPS 请求                │   │
│  │                              │   │
│  │  ← HTML/CSS/JS/Data          │   │
│  └─────────────────────────────┘   │
│          ↕                          │
│  ┌─────────────────────────────┐   │
│  │  Capacitor Plugins (原生功能)│   │
│  │  • Camera (相机)             │   │
│  │  • Notifications (通知)      │   │
│  │  • StatusBar (状态栏)        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
                ↕ HTTPS
┌─────────────────────────────────────┐
│      Next.js Server (Vercel)        │
│  • Server Actions                   │
│  • API Routes                       │
│  • Supabase Integration             │
└─────────────────────────────────────┘
```

## ⚡ 快速步骤

### 第一步：安装依赖 ✅

```bash
# 已完成！依赖已安装
npm install
```

### 第二步：部署服务器 🚀

**选项 A - Vercel（推荐，免费）**：

1. 推送代码到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 导入项目并配置环境变量
4. 部署完成，获得域名：`https://your-app.vercel.app`

**选项 B - 自建服务器**：

参考 [`DEPLOY.md`](./DEPLOY.md)

### 第三步：配置 Capacitor 🔧

编辑 `capacitor.config.ts`：

```typescript
server: {
  url: 'https://your-app.vercel.app', // 修改为你的域名
  cleartext: false,
}
```

### 第四步：准备图标 🎨

1. 创建 `resources/icon.png`（1024x1024）
2. 运行命令生成各平台图标：
   ```bash
   npx capacitor-assets generate
   ```

### 第五步：构建 APP 📦

**iOS（需要 Mac）**：
```bash
npm run ios
```

**Android**：
```bash
npm run android
```

## 📚 详细文档

完整流程请参考：

1. **[移动 APP 打包指南](./MOBILE_APP_BUILD.md)** - 详细构建步骤
2. **[App Store 上架指南](./APP_STORE_GUIDE.md)** - iOS 上架流程
3. **[Google Play 上架指南](./GOOGLE_PLAY_GUIDE.md)** - Android 上架流程

## 🎬 操作视频（建议）

建议录制以下内容作为参考：
- [ ] Vercel 部署演示
- [ ] iOS 构建和真机测试
- [ ] Android 构建和真机测试
- [ ] App Store 提交流程
- [ ] Google Play 提交流程

## ⚠️ 常见问题

### Q1: 我没有 Mac，能打包 iOS APP 吗？
**A**: 不能。iOS APP 必须在 Mac 上使用 Xcode 构建。
- **解决方案**：租用云 Mac（如 MacStadium）或找有 Mac 的朋友帮忙

### Q2: 必须先部署服务器吗？
**A**: 是的。APP 需要访问服务器才能正常工作。
- Hybrid 模式：APP 是容器，服务器提供功能
- 不部署服务器，APP 无法使用

### Q3: 能不能把所有代码打包到 APP 里？
**A**: 理论可以，但不推荐。
- 需要将 Server Actions 改为 API Routes
- 需要静态导出（`output: 'export'`）
- 功能会受限，代码改动大
- 更新麻烦（每次都要重新提交审核）

### Q4: 更新内容需要重新提交 APP 吗？
**A**: 大部分情况不需要！
- UI 更新、功能优化：只需更新服务器
- 用户下次打开自动获取最新版本
- 只有以下情况需要重新提交：
  - 修改 APP 图标/名称
  - 添加新的原生权限
  - 升级 Capacitor 版本

### Q5: 开发者账号费用？
**A**: 
- Apple Developer: $99/年（必需，用于 iOS 上架）
- Google Play: $25（一次性，用于 Android 上架）
- 国内市场：大多免费（部分需要企业认证）

### Q6: 需要软著吗？
**A**: 
- App Store / Google Play：不需要
- 国内市场：部分需要（华为、OPPO、vivo 等）
- 申请时间：1-3 个月（可加急）

### Q7: 审核要多久？
**A**: 
- App Store：1-7 天
- Google Play：1-7 天
- 国内市场：1-5 天

### Q8: 被拒审了怎么办？
**A**: 
1. 仔细阅读拒审原因
2. 修复问题
3. 回复说明
4. 重新提交（通常更快）

## 📞 获取帮助

遇到问题？
1. 查看详细文档（见上方链接）
2. 搜索 [Capacitor 官方文档](https://capacitorjs.com/docs)
3. 查看项目 GitHub Issues
4. 联系项目作者

## ✅ 检查清单

在开始之前，确保：

- [ ] 已完成 Supabase 配置（数据库、Storage）
- [ ] 应用在浏览器中正常运行
- [ ] 已部署到 Vercel 或服务器
- [ ] 准备了 1024x1024 的应用图标
- [ ] （iOS）有 Mac 电脑
- [ ] （iOS）有 Apple Developer 账号（$99/年）
- [ ] （Android）有 Google Play Console 账号（$25一次性）

## 🎯 下一步

1. ✅ 阅读完本文档
2. 📖 查看 [移动 APP 打包指南](./MOBILE_APP_BUILD.md)
3. 🚀 开始构建你的 APP！

---

Good luck! 🎉

