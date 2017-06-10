FROM mhart/alpine-node:6

RUN mkdir -p /usr/src/factorio
WORKDIR /usr/src/factorio

COPY package.json .

#RUN npm install -g npm
RUN npm install --production

COPY export .
COPY server ./server

EXPOSE 80

CMD ["npm", "start"]

#COPY nginx.conf /etc/nginx/nginx.conf

#docker build -t factorio-admin-gui ./
#docker run --rm -it -p 7000:80 -e API_URL=http://localhost:3000/ factorio-admin-gui