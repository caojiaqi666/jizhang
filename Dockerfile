# 1. 既然必须用 Node 20，我们选用兼容性最好的 slim 版本 (不要用 alpine)
FROM node:20-slim

# 2. 设置工作目录
WORKDIR /app

# 3. 【关键】使用环境变量 (ENV) 来设置国内源
# 新版 npm 不允许用 config set 设置 sharp，必须用 ENV，这样最稳
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com
ENV SHARP_BINARY_HOST=https://npmmirror.com/mirrors/sharp
ENV SHARP_LIBVIPS_BINARY_HOST=https://npmmirror.com/mirrors/sharp-libvips

# 4. 复制依赖文件
COPY package*.json ./

# 5. 安装依赖
# --no-audit: 不检查漏洞，加快速度
# --legacy-peer-deps: 忽略版本冲突，防止报错
RUN npm install --no-audit --legacy-peer-deps

# 6. 复制所有代码
COPY . .

# 7. 打包项目
# 如果你的项目需要 next build，这里会自动执行
RUN npm run build

# 8. 暴露端口
EXPOSE 3000

# 9. 启动
CMD ["npm", "start"]