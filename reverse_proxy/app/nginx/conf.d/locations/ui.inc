location / {
    limit_req zone=flood burst=100 nodelay;
    proxy_pass http://ui:3000;
    proxy_redirect off;
    proxy_cache off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr; 
    proxy_set_header X-Forwarded-For
    $proxy_add_x_forwarded_for; 
    proxy_set_header X-Forwarded-Host $server_name;
    proxy_set_header X-Forwarded-Proto $scheme;
}
