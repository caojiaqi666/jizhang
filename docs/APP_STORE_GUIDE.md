# 🍎 App Store 上架完整指南

> 本指南详细说明如何将 FlowMoney 提交到 Apple App Store

## 📋 前置准备

### 1. 注册 Apple Developer 账号

1. 访问 [Apple Developer](https://developer.apple.com)
2. 点击 "Account" 注册
3. 选择账号类型：
   - **个人开发者**：$99/年，审核快
   - **企业开发者**：$299/年，不在 App Store 展示，用于内部分发
4. 完成支付和身份验证（需要 1-2 个工作日）

### 2. 准备材料

**必需材料**：
- ✅ Apple Developer 账号
- ✅ Mac 电脑（用于 Xcode）
- ✅ APP 图标（1024x1024）
- ✅ 应用截图（不同尺寸设备）
- ✅ 应用描述文案
- ✅ 隐私政策页面 URL
- ✅ 支持 URL（可以是官网或联系方式）

**应用截图要求**：

必须提供以下尺寸的截图（每个尺寸至少 1 张，最多 10 张）：

| 设备 | 尺寸 | 分辨率 |
|------|------|--------|
| iPhone 6.7" | Portrait | 1290 x 2796 |
| iPhone 6.5" | Portrait | 1242 x 2688 |
| iPhone 5.5" | Portrait | 1242 x 2208 |
| iPad Pro 12.9" | Portrait | 2048 x 2732 |

**截图建议**：
- 展示核心功能（记账、统计、个人中心等）
- 添加文字说明突出特色
- 保持风格统一
- 避免包含个人真实信息

## 🚀 提交流程

### 步骤 1：在 App Store Connect 创建应用

1. **登录 App Store Connect**
   - 访问 https://appstoreconnect.apple.com
   - 使用 Apple Developer 账号登录

2. **创建新应用**
   - 点击 "My Apps" → "+" → "New App"
   - 填写信息：
     ```
     Platform: iOS
     Name: FlowMoney
     Primary Language: Chinese (Simplified)
     Bundle ID: com.flowmoney.app  (与 Xcode 中一致)
     SKU: flowmoney-001  (唯一标识符，自己定义)
     User Access: Full Access
     ```

3. **配置应用信息**
   
   **App Information 标签**：
   ```
   Subtitle: 心流记账，记录生活
   Privacy Policy URL: https://your-domain.com/privacy  (必需)
   Category: Primary - Finance, Secondary - Productivity
   ```

   **Pricing and Availability**：
   ```
   Price: Free (0 元)
   Availability: All countries (或选择特定国家/地区)
   ```

### 步骤 2：准备版本信息

在 "1.0 Prepare for Submission" 页面：

1. **Screenshots and App Preview**
   - 上传不同尺寸设备的截图
   - （可选）上传预览视频（15-30秒）

2. **Promotional Text**（可选，160字符）
   ```
   简洁记账，智能统计，让每一笔支出都有迹可循。支持多账本、情绪标签、数据导出等功能。
   ```

3. **Description**（4000字符以内）
   ```markdown
   FlowMoney - 心流记账

   【简介】
   FlowMoney 是一款简洁优雅的记账应用，帮助你轻松管理个人财务，记录生活点滴。

   【核心功能】
   ✓ 快速记账：3秒记一笔，简单高效
   ✓ 智能统计：多维度图表分析消费习惯
   ✓ 情绪标签：记录每笔消费时的心情
   ✓ 多账本管理：生活、工作账本分开管理（Pro）
   ✓ 数据导出：支持导出 CSV/Excel（Pro）
   ✓ 主题定制：10+ 精美主题随心换
   ✓ 存钱罐：设定储蓄目标，养成存钱习惯

   【特色亮点】
   • 界面简洁美观，操作流畅
   • 数据云端同步，永不丢失
   • 支持暗黑模式
   • 注重隐私保护

   【Pro 会员】
   升级 Pro 解锁更多高级功能：
   - 多账本管理
   - 数据导出
   - 自定义主题
   - 无广告体验

   【联系我们】
   遇到问题或建议？欢迎通过 App 内「联系作者」反馈。
   ```

4. **Keywords**（100字符，用逗号分隔）
   ```
   记账,理财,预算,消费,财务管理,账本,存钱,开支,收入,统计
   ```

5. **Support URL**
   ```
   https://your-domain.com/support
   或
   mailto:support@your-domain.com
   ```

6. **Marketing URL**（可选）
   ```
   https://your-domain.com
   ```

### 步骤 3：配置 App Review Information

1. **Contact Information**
   ```
   First Name: Your Name
   Last Name: Your Last Name
   Phone: +86 13800138000
   Email: your-email@example.com
   ```

2. **Demo Account**（如果 APP 需要登录）
   ```
   Username: demo@test.com
   Password: Demo123456

   注意：提供一个测试账号，确保审核人员能登录和测试所有功能
   ```

3. **Notes**（审核说明）
   ```
   感谢审核团队！

   【测试账号】
   账号：demo@test.com
   密码：Demo123456

   【功能说明】
   - 本应用是一款记账工具
   - 所有数据存储在 Supabase 云端
   - Pro 会员功能已在测试账号中开启

   【注意事项】
   - 请在真实设备上测试以体验完整功能
   - 相机权限用于拍照上传头像
   - 通知权限用于记账提醒（可选）

   如有任何问题，请联系：your-email@example.com
   ```

### 步骤 4：配置版本信息

1. **Version Information**
   ```
   Version: 1.0
   Copyright: 2025 Your Company/Name
   ```

2. **Build**
   - 点击 "+" 选择从 Xcode 上传的构建版本
   - 如果没有看到构建版本，说明还未上传（见下一步）

### 步骤 5：从 Xcode 上传构建

1. **在 Xcode 中打开项目**
   ```bash
   npm run cap:open:ios
   ```

2. **选择 Generic iOS Device**
   - 在顶部工具栏设备选择器中
   - 选择 "Any iOS Device (arm64)"

3. **Archive**
   - 菜单：Product → Archive
   - 等待构建完成（可能需要几分钟）

4. **上传到 App Store Connect**
   - Archive 成功后自动打开 Organizer
   - 选择刚才的 Archive
   - 点击 "Distribute App"
   - 选择 "App Store Connect"
   - 选择 "Upload"
   - 点击 "Next" → "Automatically manage signing"
   - 点击 "Upload"

5. **等待处理**
   - 上传后需要 5-15 分钟处理
   - 处理完成后会收到邮件通知
   - 在 App Store Connect 中选择这个构建版本

### 步骤 6：配置 Export Compliance

在选择构建版本后，会提示配置出口合规性：

```
Does your app use encryption? 
→ No （如果只使用 HTTPS 则选 No）

或

→ Yes, but qualifies for exemption
  - App uses standard encryption (HTTPS)
```

### 步骤 7：提交审核

1. **最终检查清单**
   - [ ] 所有必填项已完成
   - [ ] 截图已上传
   - [ ] 描述无错别字
   - [ ] 隐私政策 URL 可访问
   - [ ] 测试账号可用
   - [ ] 构建版本已选择

2. **点击 "Submit for Review"**
   - 会进入最终确认页面
   - 检查应用评级（Age Rating）
   - 确认广告标识符使用情况

3. **等待审核**
   - 状态变为 "Waiting for Review"
   - 通常 1-3 天进入审核
   - 审核时长：1-48 小时

## 📝 审核要点

### 常见拒审原因

1. **隐私问题**
   - 未提供隐私政策
   - 相机/通知权限未说明用途
   - **解决**：确保 Info.plist 中有权限说明

2. **功能不完整**
   - 测试账号无法登录
   - 核心功能无法使用
   - **解决**：提供有效测试账号，确保所有功能可用

3. **崩溃/Bug**
   - APP 启动崩溃
   - 功能使用时闪退
   - **解决**：充分测试，修复所有已知 Bug

4. **元数据问题**
   - 截图与实际功能不符
   - 描述过度宣传
   - **解决**：真实展示，避免夸大

5. **支付问题**
   - 使用第三方支付（微信/支付宝）而非 In-App Purchase
   - **解决**：使用 Apple IAP 或申请豁免

### 权限配置

编辑 `ios/App/App/Info.plist`，添加权限说明：

```xml
<key>NSCameraUsageDescription</key>
<string>需要访问相机以拍摄和上传头像</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>需要访问相册以选择和上传头像</string>

<key>NSUserTrackingUsageDescription</key>
<string>我们不会追踪您的数据，此权限仅用于改进应用体验</string>
```

### 审核加速技巧

1. **提供详细的审核说明**
2. **录制功能演示视频**（可在 Notes 中提供链接）
3. **确保测试账号有代表性数据**
4. **避免首次提交包含复杂付费功能**

## ✅ 审核通过后

1. **发布选项**
   - **Manually release this version**：手动发布（推荐）
   - **Automatically release this version**：审核通过后自动发布

2. **版本发布**
   - 审核通过后，状态变为 "Pending Developer Release"
   - 点击 "Release This Version" 发布到 App Store

3. **上线时间**
   - 发布后 1-24 小时内在 App Store 可见
   - 用户可以搜索和下载

## 🔄 后续更新

### 提交更新版本

1. 在 Xcode 中递增版本号
2. Archive 并上传新构建
3. 在 App Store Connect 创建新版本
4. 填写 "What's New in This Version"（更新说明）
5. 提交审核

### 更新说明示例

```
版本 1.1.0 更新内容：

【新功能】
• 支持面容 ID / 指纹解锁
• 新增预算提醒功能
• 支持自定义分类图标

【优化改进】
• 提升数据同步速度
• 优化统计图表展示
• 修复若干已知问题

感谢您的支持和反馈！
```

## 📊 App Store 优化（ASO）

### 标题优化
- 主标题：FlowMoney - 心流记账
- 副标题：简洁记账，智能理财

### 关键词策略
1. 核心关键词：记账、理财、预算
2. 长尾关键词：记账软件、财务管理、消费记录
3. 竞品关键词：（根据市场情况）

### 图标设计
- 简洁清晰
- 在小尺寸下可辨识
- 符合 iOS 设计规范
- 避免文字过多

### 评分和评论
- 引导满意用户评分
- 及时回复用户评论
- 根据反馈持续改进

## 🆘 问题解决

### Q: Archive 时找不到 "Generic iOS Device"
A: 确保 Xcode 设置中已登录 Apple Developer 账号

### Q: 上传后长时间显示 "Processing"
A: 正常现象，耐心等待 5-30 分钟

### Q: 构建版本缺少 Export Compliance
A: 在 TestFlight 标签页找到构建，手动添加合规信息

### Q: 审核被拒怎么办？
A: 
1. 仔细阅读拒审原因
2. 修复问题
3. 在 Resolution Center 回复说明
4. 重新提交审核

### Q: 多久能审核通过？
A: 首次提交：1-7 天；后续更新：1-3 天

## 📚 相关资源

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

---

祝您上架顺利！🎉

