FROM nginx
RUN sed -i 's^}^application/wasm wasm;}^g' /etc/nginx/mime.types
