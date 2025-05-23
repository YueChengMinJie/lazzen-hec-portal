# 良信东阳光项目

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

    gzip on;
    gzip_types text/plain application/xml application/javascript;
}
```
## route
```text
/dcybh 低残压保护
/gwmpcwg 高温母排测温柜
/jxtx 机械特性
/qyb 汽中控
/sqjsc 水汽驾驶仓
/szk 水中控
```
