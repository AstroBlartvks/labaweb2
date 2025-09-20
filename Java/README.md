# Инструкция по развертыванию на WildFly
## Сборка WAR для WildFly

### 1. Сборка WAR файла с профилем WildFly:
```bash
mvn clean package -Pwildfly
```

Это создаст файл `target/labWeb2.war`

### 2. Развертывание на WildFly

1. Запустите WildFly:
```bash
cd $WILDFLY_HOME/bin
./standalone.sh  # На Linux/Mac
standalone.bat   # На Windows
```

2. Скопируйте WAR файл в папку deployments:
```bash
cp target/labWeb2.war $WILDFLY_HOME/standalone/deployments/
```

3. Приложение будет доступно по адресу:
```
http://localhost:8080/labWeb2
```
