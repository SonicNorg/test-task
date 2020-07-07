FROM oraclelinux:7-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN yum update -y && \
  yum install -y oracle-release-el7 && \
  yum install -y oracle-nodejs-release-el7 && \
  yum install -y nodejs && \
  yum install -y oracle-instantclient19.3-basic.x86_64 && \
  yum clean all && \
  node --version && \
  npm --version && \
  npm install && \
  echo Installed

COPY . .

ENV NODE_ENV=production

ARG ORACLEDB_USER
ARG ORACLEDB_PASSWORD
ARG ORACLEDB_CONNECTIONSTRING
ARG ORACLEDB_POOL_MIN
ARG ORACLEDB_POOL_INCREMENT

ARG CS_URL_PORT
ARG CS_URL_PATH

ARG LOGGER_LEVEL

ENV ORACLEDB_USER=${ORACLEDB_USER}
ENV ORACLEDB_PASSWORD=${ORACLEDB_PASSWORD}
ENV ORACLEDB_CONNECTIONSTRING=${ORACLEDB_CONNECTIONSTRING}
ENV ORACLEDB_POOL_MIN=${ORACLEDB_POOL_MIN}
ENV ORACLEDB_POOL_INCREMENT=${ORACLEDB_POOL_INCREMENT}

ENV CS_URL_PORT=${CS_URL_PORT}
ENV CS_URL_PATH=${CS_URL_PATH}

ENV LOGGER_LEVEL=${LOGGER_LEVEL}

EXPOSE 3000

CMD ["node", "index.js"]
