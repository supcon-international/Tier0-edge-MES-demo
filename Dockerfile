# Stage 1: Build the application
FROM node:22-alpine AS build
WORKDIR /app

# 定义构建模式参数 (multi, spa, single)，默认为 multi
ARG BUILD_MODE=spa
# 为 single 模式定义模块名参数
ARG MODULE_NAME
# 新增参数：为 single 和 spa 模式定义应用的基础路径
ARG BASE_PATH=/

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
# 根据 BUILD_MODE 执行不同的构建命令
RUN if [ "$BUILD_MODE" = "spa" ]; then \
      if [ -z "$BASE_PATH" ]; then \
        echo "Error: BASE_PATH build argument must be provided for BUILD_MODE=spa." >&2; \
        exit 1; \
      fi; \
      echo "--- Running SPA build with BASE_PATH=${BASE_PATH} ---"; \
      # 使用 cross-env 强制覆盖 package.json 中的 VITE_BASE_PATH
      npx cross-env VITE_BASE_PATH=${BASE_PATH} yarn run build:spa; \
    elif [ "$BUILD_MODE" = "single" ]; then \
      if [ -z "$MODULE_NAME" ] || [ -z "$BASE_PATH" ]; then \
        echo "Error: MODULE_NAME and BASE_PATH build arguments must be provided for BUILD_MODE=single." >&2; \
        exit 1; \
      fi; \
      echo "--- Running single-module build for ${MODULE_NAME} with BASE_PATH=${BASE_PATH} ---"; \
      # 使用 cross-env 强制覆盖 package.json 中的 VITE_BASE_PATH
      npx cross-env VITE_BASE_PATH=${BASE_PATH} yarn run build:${MODULE_NAME}; \
    else \
      echo "--- Running multi-module build (using default VITE_BASE_PATH) ---"; \
      yarn run build; \
    fi

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# 清理默认文件
RUN rm -rf /usr/share/nginx/html/*

# 再次声明构建参数，以便在当前阶段使用
ARG BUILD_MODE=spa
ARG MODULE_NAME

# 1. 先将构建产物复制到临时目录
COPY --from=build /app/dist /tmp/dist

# 2. 根据模式决定最终存放路径
RUN if [ "$BUILD_MODE" = "spa" ]; then \
      # SPA模式：复制到 Nginx 根目录的 ams-spa 文件夹
      mkdir -p /usr/share/nginx/html/ams-spa && \
      cp -r /tmp/dist/ams-spa/. /usr/share/nginx/html/ams-spa/; \
    elif [ "$BUILD_MODE" = "single" ]; then \
      # 单模块模式：将构建产物（如 dist/equipment）直接复制到 Nginx 根目录
      # 此时 Nginx 将直接从 / 提供服务
      cp -r /tmp/dist/${MODULE_NAME}/. /usr/share/nginx/html/; \
    else \
      # 多模块模式：复制到 /ams-app-all/ 目录
      mkdir -p /usr/share/nginx/html/ams-app-all && \
      cp -r /tmp/dist/. /usr/share/nginx/html/ams-app-all/; \
    fi && \
    rm -rf /tmp/dist

# 确保 Nginx 用户有权限读取文件
RUN chmod -R 755 /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/conf.d/default.conf
# 根据 BUILD_MODE 复制对应的 Nginx 配置文件
COPY nginx.${BUILD_MODE}.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]