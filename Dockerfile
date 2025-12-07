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

# --- 【核心修改】 ---
# 限制 Node 堆内存为 3GB (物理1.8G + 虚拟4G，给它3G足够了)
# 这样 Node 知道自己有这么多空间，就不会还没用到 Swap 就自己崩了
# 同时也防止它无限申请内存
# ENV NODE_OPTIONS="--max-old-space-size=3072"
# ------------------

RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动
CMD ["npm", "start"]

# 在本地构建镜像
# docker build --platform linux/amd64 -t AnJiang666/jizhangapp:v1 .

# 推送到docker镜像仓库
# docker push AnJiang666/jizhangapp:v1

# 从阿里云镜像仓库拉取镜像
# docker pull crpi-t24wquf7wbhfv4px.cn-shanghai.personal.cr.aliyuncs.com/my_jing_xiang/jizhangapp:latest

# https://cr.console.aliyun.com/repository/cn-shanghai/my_jing_xiang/jizhangapp/details