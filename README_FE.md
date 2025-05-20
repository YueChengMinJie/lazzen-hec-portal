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
