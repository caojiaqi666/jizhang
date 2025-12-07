/**
 * 图标生成脚本
 * 
 * 使用说明：
 * 1. 准备一个 512x512 的高质量 PNG 图标，命名为 icon-source.png
 * 2. 放在 public 目录下
 * 3. 运行: node scripts/generate-icons.js
 * 
 * 需要安装 sharp: npm install sharp --save-dev
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 48, name: 'icon-48x48.png' },
];

const sourcePath = path.join(__dirname, '../public/icon-source.png');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  if (!fs.existsSync(sourcePath)) {
    console.error('❌ 错误: 未找到 public/icon-source.png');
    console.log('💡 请先准备一个 512x512 的图标文件，命名为 icon-source.png');
    return;
  }

  console.log('🎨 开始生成图标...\n');

  for (const { size, name } of sizes) {
    try {
      const outputPath = path.join(outputDir, name);
      await sharp(sourcePath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ 已生成: ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ 生成 ${name} 失败:`, error.message);
    }
  }

  console.log('\n🎉 图标生成完成！');
  console.log('\n💡 提示: 如果使用 SVG 图标，可以跳过这一步');
}

generateIcons().catch(console.error);




