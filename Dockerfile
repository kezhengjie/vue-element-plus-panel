# 阶段1：构建应用
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# 阶段2：生产环境部署
FROM nginx:1.25-alpine
# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html
# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]