# 依然使用 node:20-slim，保持系统兼容性
FROM node:20-slim

WORKDIR /app

# -----------------------------------------------------------
# 【绝杀步骤】直接在容器里创建 .npmrc 配置文件
# 这是 npm 的最高优先级配置，Sharp 必须服从
# -----------------------------------------------------------
RUN echo "registry=https://registry.npmmirror.com/" > .npmrc && \
    echo "sharp_binary_host=https://npmmirror.com/mirrors/sharp/" >> .npmrc && \
    echo "sharp_libvips_binary_host=https://npmmirror.com/mirrors/sharp-libvips/" >> .npmrc && \
    echo "sass_binary_site=https://npmmirror.com/mirrors/node-sass/" >> .npmrc

# 打印一下看看有没有写进去（调试用）
RUN cat .npmrc

# 复制依赖描述文件
COPY package*.json ./

# 安装依赖
# 这里的参数是为了最大程度容错
RUN npm install --no-audit --legacy-peer-deps --loglevel verbose

# 复制剩余代码
COPY . .

# 打包
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动
CMD ["npm", "start"]