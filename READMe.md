# Proyecto-Desarrollo-Web-inventario

### CREAR IMAGEN
```
docker build -t mysql-image .
```

### CREAR CONTENEDOR

``` 
docker run -d --name db -p 3306:3306 -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=app_db -e MYSQL_USER=app_user -e MYSQL_PASSWORD=app_password -v mysql_data:/var/lib/mysql mysql-image
```

### CONSULTAR DATOS

- Entrar a Bash

```
docker exec -it db bash
```

- Entrar a la base de Datos
```
mysql -u app_user -papp_password ap_db
```

- Tablas
``` sql
SELECT * FROM User; // usuario ingresados, dos tipos, administrador consultor
SELECT * FROM Element;
SELECT * FROM Category; // categorias electronicos y muebles
```
