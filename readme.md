
# Digital Entrepreneurs

Academia de Emprendimiento digital, enfocada en cursos y a la
enseñanza de trading, crypto, NFT y demas activos electronicos.





## Tecnologia

Se decidio por rendimiento y velocidad de desarrollo y despliegue
las siguientes tecnologias.

**Client:** PHP, Material Design CSS

**Server:** Node, Express, Mongodb


## REFERENCIA API


#### generar enlace de pago

```http
  POST /api/pay/sub

```

- rango mayor o igual a 0

| Parameter | Type     |Auth-token| Description                |
| :-------- | :------- | :------- | :------------------------- |
| `` | `String` |*False*| recibe el link de el QR mas el enlace de transferencia |


#### ver la cantidad de cursos que tiene un usuario

```http
  GET api/canal/creadorTotales

```

- rango mayor o igual a 1

| Parameter | Type     |Auth-token| Description                |
| :-------- | :------- | :------- | :------------------------- |
| `id` | `String` |*False*| Se le pasa el `id` de el usuario para saber el total de cursos |


#### Registrar usuario

```http
  POST /api/user/register

```

- rango mayor o igual a 0

| Parameter | Type     |Auth-token| Description                |
| :-------- | :------- | :------- | :------------------------- |
| `nombre` | `String` |*False*| Nombre del usuario |
| `correo` | `String` |*False*| Correo del usuario |
| `password` | `String` |*False*| contraseña del usuario |

#### Login

```http
  POST /api/user/login

```

- rango mayor o igual a 0

| Parameter | Type     |Auth-token| Description                |
| :-------- | :------- | :------- | :------------------------- |
| `correo` | `String` |*False*| Correo del usuario |
| `password` | `String` |*False*| contraseña del usuario |


#### Obtener usuario

```http
  GET /api/profile/user

```

- rango mayor o igual a 0

| Parameter | Type     |Auth-token| Description                |
| :-------- | :------- | :------- | :------------------------- |
|  | `String` |*True*| el identificador de el usuario lo obtiene de el token |


#### Mostrar total de usuarios

```http
  GET /api/canal/totalusers
```
- rango mayor o igual a 3

| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
|  ` `    | `number` |*True*|  no recibe parametros y envia el total de usuarios  |
|   `rango`   | `number` |*True*| **opcional** retorna el total de usuarios con el `rango`  |


#### Actualizar perfil

```http
  PUT /api/profile/user
```
- rango mayor o igual a 0

| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
|   `nombre`   | `string` |*True*| **opcional** Ingresa el `nombre` a cambiar  |
|   `correo`   | `string` |*True*| **opcional** Ingresa el `correo` a cambiar   |
|   `descripcion`   | `string` |*True*| **opcional** Ingresa la `descripcion` a cambiar   |
|   `banner`   | `string` |*True*| **opcional** Ingresa el `banner` a cambiar   |
|   `img`   | `string` |*True*| **opcional** Ingresa el `img` a cambiar   |


#### Usuario Creador

```http
  POST /api/canal/user

```

- rango mayor o igual a 1

| Parameter | Type     |Auth-token| Description                |
| :-------- | :------- | :------- | :------------------------- |
| `id` | `String` |*True*| obtiene la informacion de el usuario con el `id` solo si ese usuario es Creador |



#### Creadores con mas cursos

```http
  GET api/canal/ultimosCreadores

```

- rango mayor o igual a 1

| Parameter | Type     |Auth-token| Description                |
| :-------- | :------- | :------- | :------------------------- |
| ` ` | `String` |*True*| obtiene una lista de 8 creadores con mas cursos |


#### ultimos 10 Cursos

```http
  GET /api/canal/ultimos

```

- rango mayor o igual a 1


| Parameter | Type     |Auth-token| Description                |
| :-------- | :------- | :------- | :------------------------- |
| `` | `String` |*True*| Obtiene un array con los ultimos **10** cursos |


####  Ultimos `n` Cursos  

```http
  GET /api/canal/ultimos

```

- rango mayor o igual a 1


| Parameter | Type     |Auth-token| Description                |
| :-------- | :------- | :------- | :------------------------- |
| `limit` | `number` |*True*| retorna los ultimos ``limit` cursos de la base de datos|



#### Obtener curso en especifico por `id`

```http
  GET /api/canal/cursos
```

- rango mayor o igual a 1


| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- | :------- | :-------------------------------- |
| `id`      | `string` |*True*| trae **solo** el curso con el **id**  |

#### Obtener **todos** los cursos

```http
  GET /api/canal/cursos
```

- rango mayor o igual a 1

| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- |:-------------------------------- |
|      | `string` |*True*| se envia solo la peticion **GET**  |

#### Mostrar total de cursos

```http
  GET /api/canal/totalcursos
```

- rango mayor o igual a 3


| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
|       | `number` |*True*| no recibe ningun parametro y retorna **el numero** de cursos que hay  |


#### Obtener cursos de un **creador**

```http
  GET /api/canal/curso
```

- rango mayor o igual a 1


| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- |:-------------------------------- |
|   `id`   | `string` |*True*| se envia el `id` de el creador  |
|   `limit`   | `number` |*True*| **Opcional** la cantidad de cursos que retorna default = **todos**  |


#### Crear curso

```http
  POST /api/canal/cursos
```

- rango mayor o igual a 2


| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
| `nombre`      | `string` |*True*| Se coloca el nombre que va a tener el curso  |
| `img`      | `string` |*True*| ingresa la **URL** donde se guardo la imagen  |
| `descripcion`      | `string` |*True*| descripcion de el curso  |

#### eliminar curso

```http
  DELETE /api/canal/cursos
```

- rango mayor o igual a 2


| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
| `id_curso`      | `string` |*True*| Se coloca el **id**  de el curso |

#### Actualizar curso

```http
  PUT /api/canal/cursos
```

- rango mayor o igual a 2

| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
| `id_curso`      | `string` |*True*| Se coloca el **id**  a actualizar |
| `nombre`      | `string` |*True*| Se coloca el **nombre**  a actualizar |
| `descripcion`      | `string` |*True*| Se coloca el **descripcion**  a actualizar |
| `img`      | `string` |*True*| Se coloca el **img**  a actualizar |
| `state`      | `number` |*True*| Se envia **1** si es `true` o **0** si es `false`  |



#### buscar videos de un curso

```http
  GET /api/canal/videos
```

- rango mayor o igual a 1

| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
| `id_curso`      | `string` |*True*| ingresa el `id_curso` y trae un array con **todos** los videos  |

#### eliminar video

```http
  DELETE /api/canal/videos
```

- rango mayor o igual a 2


| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
| `id_video`      | `string` |*True*| Se coloca el **id**  de el video |


#### buscar solo un video de un curso

```http
  GET /api/canal/video
```

- rango mayor o igual a 1


| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
| `id`      | `string` |*True*| trae la informacion de un video por su `id` **solo** trae **1** registro si lo encuentra |


#### Crear video de curso

```http
  POST /api/canal/video
```

- rango mayor o igual a 2


| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
| `id_curso`      | `string` |*True*| Se coloca el `id_curso` de el curso  |
| `nombre`      | `string` |*True*| Se coloca el nombre que va a tener el curso  |
| `img`      | `string` |*True*| ingresa la **URL** donde se guardo la imagen  |
| `descripcion`      | `string` |*True*| descripcion de el curso  |



#### Actualizar video

```http
  PUT /api/canal/video
```

- rango mayor o igual a 2


| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
| `id_curso`      | `string` |*True*| Se coloca el **id**  a actualizar |
| `titulo`      | `string` |*True*| Se coloca el **nombre**  a actualizar |
| `descripcion`      | `string` |*True*| Se coloca el **descripcion**  a actualizar |
| `video_url`      | `string` |*True*| Se coloca el **img**  a actualizar |
| `state`      | `number` |*True*| Se envia **1** si es `true` o **0** si es `false` |


#### verificar si hay streaming

```http
  GET /api/canal/stream
```

- rango mayor o igual a 1


| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
| ``      | `string` |*True*| retorna error **1** si no hay y **0** si hay  |

#### Crear streaming

```http
  POST /api/canal/streaming
```

- rango mayor o igual a 2

| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
| `year`     | `number` |*True*| año del streaming  |
| `mes`      | `number` |*True*|  mes del streaming |
| `dia`      | `number` |*True*|  dia del streaming |
| `hora`     | `number` |*True*|  hora del streaming |

#### Eliminar streaming

```http
  DELETE /api/canal/streaming
```

- rango mayor o igual a 2


| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
| `id`      | `string` |*True*| `id` de el streaming  |


## RUTAS DE DESAROLLO

#### **NO USAR PARA PRODUCCION**

#### Cambiar rango

```http
  PUT /api/canal/rango
```

| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
| `id`      | `string` |*True*| ingresa el `id` de el usuario |
| `rango`      | `number` |*True*| ingresa `rango` a asignar |

#### traer todos los usuarios

```http
  GET /api/canal/allusers
```

| Parameter | Type     |Auth-token| Description                       |
| :-------- | :------- |:------- | :-------------------------------- |
|       | `string` |*True*| no recibe parametros y retorna todos los usuario **CUIDADO** |