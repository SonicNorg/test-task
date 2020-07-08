
# CS Модуль проверки статуса абонента

## Overview
This server was generated using the [OpenAPI Generator](https://openapi-generator.tech) project.  The code generator, and it's generated code allows you to develop your system with an API-First attitude, where the API contract is the anchor and definer of your project, and your code and business-logic aims to complete and comply to the terms in the API contract.

### Предустановка
- Git Bash >= 2.24.0
- Docker >= 19.03.0

### Запуск приложения

#### Сборка артефакта
1. Склонировать репозиторий.
2. Перейти в модель "cs"
3. Заппустить сборку образа
```
docker build --no-cache --force-rm=true -t <имя_образа> .
```

#### Запуск приложения

    docker run -d \
        --name <имя_контейнера> -it \
        -e ORACLEDB_USER=<имя_пользователя_бд> \
        -e ORACLEDB_PASSWORD=<пароль_пользователя_бд> \
        -e ORACLEDB_CONNECTIONSTRING=<путь_подключения_бд> \
        -e ORACLEDB_POOL_MIN=<минимальный_пул> \
        -e ORACLEDB_POOL_MAX=<максимальный_пул> \
        -e ORACLEDB_POOL_INCREMENT=<пул_increment> \
        -e CS_URL_PORT=<порт_модуля_CS> \
        -e CS_URL_PATH=<url_модуля_CS> \
        -e CS_URL_PATH=<url_модуля_CS> \
        -e LOGGER_LEVEL=<уровень_логирования> \
        -p 3000:3000 \
        <имя_образа>
        
        Parameters:
                    --name                          The name of the container (default: auto generated)
                    -p:                             The port mapping of the host portto the container port
                                                    One port are exposed: 3000
                    -e ORACLEDB_USER                (default: '')
                    -e ORACLEDB_PASSWORD            (default: '')
                    -e ORACLEDB_CONNECTIONSTRING    (default: '')
                    -e ORACLEDB_POOL_MIN            (default: 10)
                    -e ORACLEDB_POOL_MAX            (default: 10)
                    -e ORACLEDB_POOL_INCREMENT      (default: 0)
                    -v /usr/src/app         Folder for logs.
                    
         P.S. RACLEDB_POOL_MIN и RACLEDB_POOL_MAX одинакове, и ORACLEDB_POOL_INCREMENT установлен в 0. 
         Это создаст пул фиксированного размера, который требует меньше ресурсов для управления — для пулов, которые получают согласованное использование

**FOR EXAMPLE:**
    
    docker run -d \
    --name cs-container -it \
    -e ORACLEDB_USER=USER_DB \
    -e ORACLEDB_PASSWORD=PASSWORD_DB \
    -e ORACLEDB_CONNECTIONSTRING=loclhost:1521/osadb.oracle.com \
    -p 3001:3000 \
    cs-images:latest
    
