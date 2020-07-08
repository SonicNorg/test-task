![](../../img/Tieto_logo.png) 
# PG Модуль приема запросов на платеж

### Предустановка
- Git Bash >= 2.24.0
- Docker >= 19.03.0

### Сборка и деплой приложения

#### Сборка артефакта
1. Склонировать репозиторий.
2. Перейти в модуль "pg"
3. Заппустить сборку образа
```
docker build --no-cache --force-rm=true -t <имя_образа> .
```
**NOTE** : Докер образ поддерживает создание переменных среды на этапе сборки

**FOR EXAMPLE:**
```
docker build --build-arg ORACLEDB_USER=<имя_пользователя_бд> --build-arg ORACLEDB_USER=<пароль_пользователя_бд> ...
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
        -e LOGGER_LEVEL=<уровень_логирования> \
        -v [<host mount point>:]/usr/src/app/logs \
        -p 3000:3000 \
        <имя_образа>
    
        Parameters:
            --name                          The name of the container (default: auto generated)
            -p:                             The port mapping of the host portto the container port
                                            One port are exposed: 3000
            -e NODE_ENV                     Среда развертивания запуска (default: 'production')
            -e ORACLEDB_USER                (default: '')
            -e ORACLEDB_PASSWORD            (default: '')
            -e ORACLEDB_CONNECTIONSTRING    (default: '')
            -e ORACLEDB_POOL_MIN            (default: 10)
            -e ORACLEDB_POOL_MAX            (default: 10)
            -e ORACLEDB_POOL_INCREMENT      (default: 0)
            -e CS_URL_PORT                  Порт модуля CS
            -e CS_URL_PATH                  URL модуля CS
            -e ACTIVE_CUSTOMER_PAYMENT      (default: true)
            -e INACTIVE_CUSTOMER_PAYMENT    (default: false)
            -e LOGGER_LEVEL                 (default: error)
            -v /usr/src/app/logs            Путь к файлам логов
            
    P.S. RACLEDB_POOL_MIN и RACLEDB_POOL_MAX одинакове, и ORACLEDB_POOL_INCREMENT установлен в 0. 
    Это создаст пул фиксированного размера, который требует меньше ресурсов для управления — для пулов, которые получают согласованное использование

**FOR EXAMPLE:**
    
    docker run -d \
        --name pg-container -it \
        -e ORACLEDB_USER=USER_DB \
        -e ORACLEDB_PASSWORD=PASSWORD_DB \
        -e ORACLEDB_CONNECTIONSTRING=loclhost.ru:1521/osadb.oracle.com \
        -e CS_URL_PORT=3001 \
        -e CS_URL_PATH=http://lovalhost.ru \
        -p 3000:3000 \
        pg-images:latest
