# 1. 使用 Node.js 18 作为基础环境
FROM node:20-alpine

# 2. 设置工作目录
WORKDIR /app

# --- 关键修改开始 ---
# 设置 npm 淘宝源
RUN npm config set registry https://registry.npmmirror.com

# 【重点】强制设置 Sharp 的下载源为国内镜像（解决你刚才的报错）
RUN npm config set sharp_binary_host "https://npmmirror.com/mirrors/sharp"
RUN npm config set sharp_libvips_binary_host "https://npmmirror.com/mirrors/sharp-libvips"
# --- 关键修改结束 ---

# 3. 复制依赖文件
COPY package*.json ./

# 4. 安装依赖
RUN npm install

# 5. 复制所有代码
COPY . .

# 6. 打包
RUN npm run build

# 7. 暴露端口
EXPOSE 3000

# 8. 启动
CMD ["npm", "start"]