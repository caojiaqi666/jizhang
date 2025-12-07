#!/bin/bash

# PWA 部署前检查脚本

echo "🔍 开始部署前检查..."
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查计数
ERRORS=0
WARNINGS=0

# 1. 检查 Node 版本
echo "📦 检查 Node.js 版本..."
NODE_VERSION=$(node -v)
echo "   当前版本: $NODE_VERSION"
if [[ ! "$NODE_VERSION" =~ ^v(18|20|22) ]]; then
    echo -e "   ${YELLOW}⚠️  建议使用 Node 18, 20 或 22${NC}"
    WARNINGS=$((WARNINGS+1))
else
    echo -e "   ${GREEN}✅ Node 版本正常${NC}"
fi
echo ""

# 2. 检查依赖
echo "📚 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo -e "   ${YELLOW}⚠️  node_modules 不存在，运行 npm install...${NC}"
    npm install
fi
echo -e "   ${GREEN}✅ 依赖检查完成${NC}"
echo ""

# 3. 检查 PWA 文件
echo "🔧 检查 PWA 必需文件..."
PWA_FILES=(
    "public/manifest.json"
    "public/sw.js"
    "public/icon.svg"
    "next.config.ts"
)

for file in "${PWA_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✅ $file${NC}"
    else
        echo -e "   ${RED}❌ 缺少: $file${NC}"
        ERRORS=$((ERRORS+1))
    fi
done
echo ""

# 4. 检查图标文件
echo "🎨 检查图标文件..."
ICON_FILES=(
    "public/icon-192x192.png"
    "public/icon-512x512.png"
    "public/apple-touch-icon.png"
)

ICON_MISSING=0
for file in "${ICON_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✅ $file${NC}"
    else
        echo -e "   ${YELLOW}⚠️  可选图标缺失: $file${NC}"
        ICON_MISSING=$((ICON_MISSING+1))
    fi
done

if [ $ICON_MISSING -gt 0 ]; then
    echo -e "   ${YELLOW}💡 提示: 可以使用 icon.svg 或运行 npm run generate-icons${NC}"
    WARNINGS=$((WARNINGS+1))
fi
echo ""

# 5. 检查环境变量
echo "🔐 检查环境变量..."
if [ -f ".env" ] || [ -f ".env.local" ]; then
    echo -e "   ${GREEN}✅ 发现本地环境变量文件${NC}"
    echo -e "   ${YELLOW}⚠️  请确保在 Vercel 中配置了生产环境变量${NC}"
else
    echo -e "   ${YELLOW}⚠️  未发现环境变量文件${NC}"
fi
echo ""

# 6. 运行构建测试
echo "🏗️  测试构建..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✅ 构建成功${NC}"
else
    echo -e "   ${RED}❌ 构建失败，请检查错误${NC}"
    echo "   运行 npm run build 查看详细错误"
    ERRORS=$((ERRORS+1))
fi
echo ""

# 7. 运行 PWA 检查
echo "📱 运行 PWA 配置检查..."
if [ -f "scripts/check-pwa.js" ]; then
    npm run check-pwa
else
    echo -e "   ${YELLOW}⚠️  未找到 check-pwa.js${NC}"
fi
echo ""

# 8. 检查 Git 状态
echo "📝 检查 Git 状态..."
if [ -d ".git" ]; then
    UNCOMMITTED=$(git status --porcelain | wc -l)
    if [ $UNCOMMITTED -gt 0 ]; then
        echo -e "   ${YELLOW}⚠️  有 $UNCOMMITTED 个未提交的更改${NC}"
        echo "   运行 git status 查看"
        WARNINGS=$((WARNINGS+1))
    else
        echo -e "   ${GREEN}✅ 所有更改已提交${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  未初始化 Git 仓库${NC}"
    WARNINGS=$((WARNINGS+1))
fi
echo ""

# 总结
echo "================================="
echo "检查完成！"
echo "================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 所有检查通过！可以部署了！${NC}"
    echo ""
    echo "下一步："
    echo "  1. 确保代码已推送到 GitHub"
    echo "  2. 在 Vercel 配置环境变量"
    echo "  3. 运行: vercel --prod"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠️  发现 $ERRORS 个错误，$WARNINGS 个警告${NC}"
    echo ""
    if [ $ERRORS -gt 0 ]; then
        echo -e "${RED}❌ 请先修复错误再部署${NC}"
        exit 1
    else
        echo -e "${YELLOW}⚠️  有一些警告，但可以继续部署${NC}"
        echo ""
        echo "是否继续？(y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo "继续部署..."
            exit 0
        else
            echo "已取消"
            exit 1
        fi
    fi
fi




