# FlowMoney (心流记账)

一款注重情绪价值、设计精美的跨平台记账应用。

## 🌟 核心特性

*   **极速记账**: 3秒内完成记录，支持智能分类。
*   **情绪记录**: 不只是记账，更记录当下的心情（开心、焦虑、后悔...）。
*   **情绪账单**: 独家“情绪分析”报表，帮你觉察消费背后的情绪驱动。
*   **跨平台**: 支持 Web、PWA、iOS 原生应用、Android 原生应用。
*   **高颜值**: 现代化的 UI 设计，支持自定义主题和背景。

## 🛠️ 技术栈

*   **框架**: Next.js 16 (App Router)
*   **语言**: TypeScript
*   **样式**: Tailwind CSS + Shadcn/UI
*   **后端**: Supabase (Auth, PostgreSQL, Storage)
*   **移动端**: Capacitor (iOS & Android)
*   **图表**: Recharts
*   **动画**: Framer Motion

## 🚀 快速开始

1.  **克隆项目**
    ```bash
    git clone https://github.com/your-username/flow-money.git
    cd flow-money
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置环境变量**
    复制 `.env.example` 为 `.env.local` 并填入您的 Supabase 密钥。
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    ```

4.  **启动开发服务器**
    ```bash
    npm run dev -- --webpack
    ```

## 📱 移动端支持

### PWA 快速安装
*   **iOS**: 在 Safari 中打开 → 点击分享按钮 → 添加到主屏幕
*   **Android**: 在 Chrome 中打开 → 点击菜单 → 安装应用

### 原生 APP 打包

FlowMoney 支持打包为原生 iOS 和 Android 应用：

```bash
# 构建 iOS APP（需要 Mac + Xcode）
npm run ios

# 构建 Android APP
npm run android
```

**详细指南**：
- 📖 [移动 APP 快速开始](./docs/MOBILE_QUICK_START.md)
- 📱 [完整打包指南](./docs/MOBILE_APP_BUILD.md)
- 🍎 [App Store 上架指南](./docs/APP_STORE_GUIDE.md)
- 🤖 [Google Play 上架指南](./docs/GOOGLE_PLAY_GUIDE.md)

## 📚 文档

- [部署指南](./docs/DEPLOY.md)
- [数据库设计](./docs/DB_SCHEMA.sql)
- [移动 APP 快速开始](./docs/MOBILE_QUICK_START.md)
- [Storage 配置](./docs/setup_storage.sql)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
