# 良信东阳光项目

## 环境
- Node.js 20.11.30 或更高版本
- pnpm 10.10.0

## 技术栈
- 前端框架：Vue 3 + TypeScript
- 状态管理：Pinia
- 构建工具：Vite 4
- UI 组件库：Ant Design Vue 4.x
- CCS 组件库：Tailwindcss 4.x
- 网络请求：Axios 1.9.x
- 工具库：VueUse 12.x defu qs

## 配置
```text
正式环境：.env.production
预发环境：.env.uat
测试环境：.env.sit
```

```text
# 是否使用cdn
VITE_USE_CDN=false

# 是否压缩图片
VITE_USE_IMAGEMIN=true

# 是否移除日志及debugger
VITE_DROP_CONSOLE=true

# 接口地址
VITE_GLOB_API_URL=

# 接口地址前缀
VITE_GLOB_API_URL_PREFIX=/api

# 是否输出gz｜br文件
# 可选: gzip | brotli | none
# 也可以有多个, 例如 gzip|brotli,这样会同时生成 .gz和.br文件
VITE_BUILD_COMPRESS=gzip

# 是否删除源文件
VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE=false
```

## 运行编译
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产环境包（按需选择）
pnpm run build:sit   # 测试环境
pnpm run build:uat   # 预发环境
pnpm run build       # 正式环境
```

## 跨环境部署
```bash
$env:NODE_ENV="production"; pnpm run build
```

## Nginx 配置示例
```nginx configuration
server {
    listen       80;
    server_name  hec.example.com;
    
    location / {
        root   /www/hec-portal/dist;
        index  index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend-server:8975/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 开启gzip
    gzip on;
    gzip_types text/plain application/xml application/javascript;
}
```
