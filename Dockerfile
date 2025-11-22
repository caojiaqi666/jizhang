# 1. 使用 Node.js 18 作为基础环境
FROM node:20-alpine

# 2. 设置工作目录
WORKDIR /app

# --- 新增步骤：设置国内淘宝镜像源，加速下载 ---
RUN npm config set registry https://registry.npmmirror.com

# 3. 先复制依赖描述文件
COPY package*.json ./

# 4. 安装项目依赖（这时候就会飞快）
RUN npm install

# 5. 把所有代码复制进去
COPY . .

# 6. 打包项目
RUN npm run build

# 7. 暴露 3000 端口
EXPOSE 3000

# 8. 启动项目
CMD ["npm", "start"]