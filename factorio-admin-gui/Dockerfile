FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY index.html .
COPY scripts ./scripts
COPY src/css ./src/css
COPY src/fonts ./src/fonts
COPY src/style.css ./src
#COPY nginx.conf /etc/nginx/nginx.conf