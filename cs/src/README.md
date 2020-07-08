![](../../img/Tieto_logo.png) 
# CS Модуль проверки статуса абонента


### Предустановка
- Git Bash >= 2.24.0
- Docker >= 19.03.0

### Сборка и деплой приложения

#### Сборка артефакта
1. Склонировать репозиторий.
2. Перейти в модуль "cs"
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
        -e LOGGER_LEVEL=<уровень_логирования> \
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
            -v /usr/src/app/logs            Путь к файлам логов
                    
         P.S. RACLEDB_POOL_MIN и RACLEDB_POOL_MAX одинакове, и ORACLEDB_POOL_INCREMENT установлен в 0. 
         Это создаст пул фиксированного размера, который требует меньше ресурсов для управления — для пулов, которые получают согласованное использование

**FOR EXAMPLE:**
    
    docker run -d \
        --name cs-container -it \
        -e ORACLEDB_USER=USER_DB \
        -e ORACLEDB_PASSWORD=PASSWORD_DB \
        -e ORACLEDB_CONNECTIONSTRING=loclhost.ru:1521/osadb.oracle.com \
        -p 3001:3000 \
        cs-images:latest
    
