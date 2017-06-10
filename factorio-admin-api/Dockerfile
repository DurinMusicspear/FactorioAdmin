FROM frolvlad/alpine-glibc:alpine-3.5
#FROM mhart/alpine-node:6

#MAINTAINER https://github.com/dtandersen/docker_factorio_server

ENV VERSION=0.15.19 \
    SHA1=d78300a088fba62d745bea5d3b1172aebc5f94c3

RUN mkdir /opt && \
    apk add --update --no-cache nodejs && \
    apk add --update --no-cache tini pwgen && \
    apk add --update --no-cache --virtual .build-deps curl && \
    curl -sSL https://www.factorio.com/get-download/$VERSION/headless/linux64 \
        -o /tmp/factorio_headless_x64_$VERSION.tar.xz && \
    #echo "$SHA1  /tmp/factorio_headless_x64_$VERSION.tar.xz" | sha1sum -c && \
    tar xf /tmp/factorio_headless_x64_$VERSION.tar.xz --directory /opt && \
    rm /tmp/factorio_headless_x64_$VERSION.tar.xz && \
    ln -s /factorio/saves /opt/factorio/saves && \
    ln -s /factorio/mods /opt/factorio/mods && \
    apk del .build-deps

# Create app directory
RUN mkdir -p /opt/factorio-server-api/
WORKDIR /opt/factorio-server-api/

# Install app dependencies
COPY package.json /opt/factorio-server-api/

#RUN npm install -g npm
RUN npm install --production

COPY . /opt/factorio-server-api/

#ENTRYPOINT ["./run.sh"]

VOLUME /factorio

EXPOSE 34197/udp 27015/tcp 80/tcp

COPY ./docker-entrypoint.sh /

#ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/docker-entrypoint.sh"]
# CMD ["npm", "start"]

#docker build -t factorio-admin-api ./
#docker run --rm -it -p 3000:3000 -p 34197:34197/udp -p 27015:27015 -e SAVE_FOLDER=/opt/factorio/saves -e CONFIG_FOLDER=/factorio/config -e EXECUTABLE_FOLDER=/opt/factorio/bin/x64 factorio-admin-api