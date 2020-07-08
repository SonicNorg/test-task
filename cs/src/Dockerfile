FROM oraclelinux:7-slim

RUN yum update -y && \
    yum install -y oracle-release-el7 && \
    yum install -y oracle-nodejs-release-el7 && \
    yum install -y nodejs && \
    yum install -y oracle-instantclient19.3-basic.x86_64 && \
    yum install -y java-1.8.0-openjdk && \
    yum clean all && \
    node --version && \
    npm --version && \
    echo Installed

ENV NODE_ENV=production

ARG ORACLEDB_USER
ARG ORACLEDB_PASSWORD
ARG ORACLEDB_CONNECTIONSTRING
ARG ORACLEDB_POOL_MIN
ARG ORACLEDB_POOL_MAX
ARG ORACLEDB_POOL_INCREMENT
ARG LOGGER_LEVEL

ENV ORACLEDB_USER=${ORACLEDB_USER}
ENV ORACLEDB_PASSWORD=${ORACLEDB_PASSWORD}
ENV ORACLEDB_CONNECTIONSTRING=${ORACLEDB_CONNECTIONSTRING}
ENV ORACLEDB_POOL_MIN=${ORACLEDB_POOL_MIN}
ENV ORACLEDB_POOL_MAX=${ORACLEDB_POOL_MAX}
ENV ORACLEDB_POOL_INCREMENT=${ORACLEDB_POOL_INCREMENT}
ENV LOGGER_LEVEL=${LOGGER_LEVEL}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && \
    echo Installed

COPY . .

RUN npm run info && \
    npm run migrate && \
    echo Installed

EXPOSE 3000

CMD ["node", "index.js"]
