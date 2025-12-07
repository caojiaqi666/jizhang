# PWA 图标制作指南

## 📐 图标尺寸要求

### 必需的图标

| 尺寸 | 文件名 | 用途 |
|------|--------|------|
| 192x192 | `icon-192x192.png` | Android 主屏幕图标 |
| 512x512 | `icon-512x512.png` | Android 安装横幅、启动屏幕 |
| 180x180 | `apple-touch-icon.png` | iOS 主屏幕图标 |

### 可选图标（提升体验）

| 尺寸 | 文件名 | 用途 |
|------|--------|------|
| 152x152 | `icon-152x152.png` | iPad |
| 144x144 | `icon-144x144.png` | Windows |
| 128x128 | `icon-128x128.png` | Chrome Web Store |
| 96x96 | `icon-96x96.png` | 低分辨率设备 |

## 🎨 设计建议

### 1. 图标设计原则

- **简洁明了**: 图标应该一眼就能识别
- **高对比度**: 确保在各种背景下都清晰可见
- **品牌一致**: 与应用的整体设计风格一致
- **安全区域**: 留出 10% 的边距，避免被裁切

### 2. 颜色选择

- 使用品牌主色调
- 避免使用纯白或纯黑背景
- 考虑深色模式下的显示效果

### 3. 形状建议

**圆角正方形** (推荐)
- 适用于所有平台
- 看起来现代、友好
- 推荐圆角半径: 12-18% 

**圆形**
- 适合简单的图标
- 在 Android 上自动适配

**自适应图标** (Android)
- 提供一个可被裁切的图标
- 使用 `purpose: "maskable"` 属性

## 🛠️ 制作工具

### 在线工具（推荐新手）

1. **PWA Builder Image Generator**
   - 网址: https://www.pwabuilder.com/imageGenerator
   - 上传一个大图，自动生成所有尺寸
   - 免费且易用

2. **RealFaviconGenerator**
   - 网址: https://realfavicongenerator.net/
   - 支持预览在不同设备上的效果
   - 自动生成完整的 HTML 代码

3. **Favicon.io**
   - 网址: https://favicon.io/
   - 可以从文字、图片或 Emoji 生成图标
   - 适合快速原型

### 专业工具

1. **Figma** (推荐)
   - 免费在线设计工具
   - 强大的矢量编辑功能
   - 可以导出各种尺寸

2. **Adobe Illustrator**
   - 专业矢量图设计
   - 适合精细调整

3. **Sketch** (macOS)
   - UI 设计专用工具

### 命令行工具

使用我们提供的脚本：

```bash
# 1. 准备一个 512x512 的源图标
cp your-icon.png public/icon-source.png

# 2. 安装 sharp
npm install sharp --save-dev

# 3. 运行生成脚本
node scripts/generate-icons.js
```

## 📝 快速开始

### 方法 1: 使用 SVG（最简单）

如果你有 SVG 格式的图标：

1. 将 SVG 文件放到 `public/icon.svg`
2. manifest.json 中已配置 SVG 图标
3. 无需生成其他尺寸（但建议生成 PNG 备用）

**优势**:
- 文件小
- 任意缩放不失真
- 维护简单

### 方法 2: 在线生成

1. 访问 https://www.pwabuilder.com/imageGenerator
2. 上传你的图标（建议 1024x1024，PNG 格式）
3. 调整 padding 和背景色
4. 下载生成的图标包
5. 解压并将文件放入 `public/` 目录

### 方法 3: 使用 Emoji（超简单）

```bash
# 访问 https://favicon.io/emoji-favicons/
# 选择一个 emoji，下载图标包
# 将文件放入 public/ 目录
```

适合快速原型或有趣的项目！

## 🔍 图标检查清单

完成后，请确认：

- [ ] `icon-192x192.png` 存在且大小正确
- [ ] `icon-512x512.png` 存在且大小正确
- [ ] `apple-touch-icon.png` 存在（iOS 必需）
- [ ] 图标在浅色背景下清晰可见
- [ ] 图标在深色背景下清晰可见
- [ ] 图标边缘留有适当边距（不被裁切）
- [ ] manifest.json 中正确引用了图标
- [ ] 运行 `node scripts/check-pwa.js` 检查通过

## 📱 测试图标

### iOS Safari
1. 添加到主屏幕
2. 检查图标是否清晰
3. 查看是否有白边或变形

### Android Chrome
1. 安装应用
2. 查看应用抽屉中的图标
3. 测试启动屏幕显示

### 桌面浏览器
1. 安装 PWA
2. 查看任务栏/Dock 中的图标
3. 检查窗口标题栏图标

## 🎯 优化建议

### 1. 文件大小

- PNG 图标应该压缩
- 使用 TinyPNG 或 ImageOptim
- 目标: 每个图标 < 50KB

### 2. 自适应图标 (Maskable)

在 manifest.json 中设置：

```json
{
  "icons": [
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Maskable 图标要求**:
- 重要内容放在中心 80% 区域
- 周围 20% 可能被裁切
- 使用纯色背景填充整个画布

### 3. 启动屏幕

iOS 需要单独的启动屏幕图片：

```html
<link rel="apple-touch-startup-image" 
      href="/splash-iphone-15.png"
      media="(device-width: 393px) and (device-height: 852px)">
```

可以使用 https://progressier.com/pwa-screenshots-generator 生成。

## 🌟 示例图标

### 简约风格
```
┌─────────────────┐
│                 │
│       🍡        │
│    麻薯记账      │
│                 │
└─────────────────┘
```

### 渐变风格
```
┌─────────────────┐
│   ╔═══════╗    │
│   ║ 💰    ║    │
│   ║  $    ║    │
│   ╚═══════╝    │
└─────────────────┘
(Teal to Green gradient)
```

### 文字图标
```
┌─────────────────┐
│                 │
│       麻         │
│       薯         │
│                 │
└─────────────────┘
(Clean, minimal)
```

## 🔧 故障排除

### 问题: 图标显示为白色方块
**解决**: 确保图标有背景色，或使用带透明度的 PNG

### 问题: iOS 图标有白边
**解决**: 
1. 使用 `apple-touch-icon` 专用图标
2. 确保图标填满整个画布（不留透明边缘）

### 问题: Android 图标被裁切
**解决**: 
1. 检查是否留出了安全区域
2. 使用 maskable 图标
3. 在 https://maskable.app/ 上测试

### 问题: 图标模糊
**解决**: 
1. 使用更高分辨率的源图
2. 确保导出时选择了正确的尺寸
3. 不要放大小图标

## 📚 参考资源

- [PWA 图标官方指南](https://web.dev/add-manifest/)
- [Maskable 图标编辑器](https://maskable.app/editor)
- [iOS 图标指南](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Android 自适应图标](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)

---

有问题？检查一下这些常见错误：
1. ❌ 图标文件名拼写错误
2. ❌ 图标不是正方形
3. ❌ 使用了 JPEG 而不是 PNG
4. ❌ 图标太小（低于要求的尺寸）
5. ❌ 忘记更新 manifest.json

祝你设计出完美的图标！🎨




