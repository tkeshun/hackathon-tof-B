## https対応のための証明書作成手順

1. ```openssl genrsa 4096 > private_key.pem```
1. ```openssl req -new -key private_key.pem > server.csr```
1. ```openssl x509 -days 3650 -req -signkey private_key.pem < server.csr > server.crt```
