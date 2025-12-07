/**
 * PWA 配置检查脚本
 * 
 * 运行: node scripts/check-pwa.js
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

const requiredFiles = [
  'manifest.json',
  'sw.js',
  'offline.html',
  'icon.svg',
];

const optionalFiles = [
  'icon-192x192.png',
  'icon-512x512.png',
  'apple-touch-icon.png',
  'browserconfig.xml',
];

console.log('🔍 检查 PWA 配置...\n');

let allGood = true;

console.log('📋 必需文件:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(publicDir, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allGood = false;
});

console.log('\n📋 可选文件:');
optionalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(publicDir, file));
  console.log(`  ${exists ? '✅' : '⚠️ '} ${file}`);
});

// 检查 manifest.json
const manifestPath = path.join(publicDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('\n📱 Manifest 信息:');
    console.log(`  名称: ${manifest.name || '未设置'}`);
    console.log(`  短名称: ${manifest.short_name || '未设置'}`);
    console.log(`  主题色: ${manifest.theme_color || '未设置'}`);
    console.log(`  图标数量: ${manifest.icons?.length || 0}`);
    
    if (!manifest.name) {
      console.log('  ⚠️  建议设置 name 字段');
      allGood = false;
    }
    if (!manifest.icons || manifest.icons.length === 0) {
      console.log('  ⚠️  建议添加图标');
      allGood = false;
    }
  } catch (error) {
    console.log(`  ❌ manifest.json 格式错误: ${error.message}`);
    allGood = false;
  }
}

// 检查 next.config
const nextConfigPath = path.join(__dirname, '../next.config.ts');
if (fs.existsSync(nextConfigPath)) {
  const content = fs.readFileSync(nextConfigPath, 'utf8');
  const hasPWA = content.includes('next-pwa');
  console.log('\n⚙️  Next.js 配置:');
  console.log(`  ${hasPWA ? '✅' : '❌'} next-pwa 已配置`);
  if (!hasPWA) allGood = false;
}

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ PWA 配置检查通过！');
  console.log('\n下一步:');
  console.log('  1. 运行 npm run build 构建生产版本');
  console.log('  2. 部署到支持 HTTPS 的服务器');
  console.log('  3. 在手机上测试安装功能');
} else {
  console.log('⚠️  发现一些问题，请修复后再部署');
}
console.log('='.repeat(50));




