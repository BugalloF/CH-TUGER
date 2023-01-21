## SETUP
Node: 12.18.3 o mayor
NPM: 6.14.16 o mayor

Crear una base de datos postgres en su computadora con el nombre 'challenge'

correr el siguiente comando en la terminal (parado en el directorio del challenge) y editar .env con los datos de ingreso de su usuario postgres

cp .env.example .env

Una vez que tenga la conexión a la base de datos hecha, puede cargar data de antemano para realizar las futuras pruebas. 

PARA CORRER ESTOS COMANDOS DEBE ESTAR PARADO EN LA CARPETA /data Y CORRERLOS EN ESE ORDEN. PONER SU USERNAME, SOLICITARÁ CONTRASEÑA LUEGO DE CORRER


psql --file=rooms_202301211715.sql --host=localhost --port=5432 --username=carbonfootprint --dbname=challenge
psql --file=clients_202301211715.sql --host=localhost --port=5432 --username=carbonfootprint --dbname=challenge
psql --file=bookings_202301211715.sql --host=localhost --port=5432 --username=carbonfootprint --dbname=challenge


## ENDPOINTS PARA POSTMAN
Ver todos los clientes 
http://localhost:3001/clients

Ver todos los cuartos 

http://localhost:3001/rooms

Ver todas las reservas:

http://localhost:3001/booking

Buscar cuartos para reservar entre 1/5/23 y el 1/7/2023  (FORMATO MES/DIA/AÑO)

GET http://localhost:3001/rooms/?enter=1/5/2023&exit=1/7/2023 


Buscar disponibilidad de un cuarto con características específicas

GET http://localhost:3001/rooms/?enter=2/5/2023&exit=2/7/2023&beds=1&bathrooms=1&has_fridge=true

Buscar disponibilidad de un cuarto específico para una fecha 

GET http://localhost:3001/rooms/availability/2/?enter=1/1/2022&exit=1/27/2022


## DETALLES CHALLENGE y más endpoints para probar

Para desarrollar el challenge se crearon 3 tablas en la base de datos:
Client,Booking,Room.

Para poder interactuar con dicha base se crearon los siguientes endpoints:
/clients
/booking
/rooms

## /clients

## GET

recurso '/'
Devuelve todos los usuarios registrados junto con sus reservas.

recurso '/:id/'
Devuelve un usuario específico junto con todas las reservas.

## POST
recurso '/'
Necesita para crear un usuario: name,email y phone ( ESTOS DATOS CORRESPONDERÍAN A DATOS DE FACTURACIÓN DEL CLIENTE )

## DELETE
recurso '/:id/'
Elimina el cliente, devuelve un estado 204.


## /bookings

## GET

recurso '/'
devuelve Todas las reservas

recurso '/?status=<Value>'
Devuelve todas las reservas en el estado que se requiera (Pending,Paid,Eliminated)

## Post

recurso '/'

Agrega una reserva a la base de datos. 
Necesita: status,payment,amount,arrival_date,departure_date,clientId,roomId
Verifica que no haya una reserva previa en la habitación para esa fecha y devuelve un mensaje de reserva hecha.

## PUT

recurso '/:id/
Sirve para alterar el estado o el pago de la reserva. Capaz una persona dijo que pagaría en efectivo y terminó pagando con tarjeta.

## DELETE
recurso '/:id'

Elimina una reserva


## /rooms
## GET
Posibles querys dentro del endpoint:
Enter , exit, beds.has_fridge,bathrooms


Hice el endpoint así ya que no tuve mucho tiempo y preferí filtrar todo junto, pero se podría hacer por separado e ir filtrando o sólo por cantidad de camas, o por si tiene heladera, o por cantidad de baños. En este caso hay que filtrar por las 3 cosas a la vez si es que se desea.

recurso '/' ( sin querys )
Devuelve todos los cuartos con todas sus reservas.

recurso '/?enter=mm/dd/yyyy&exit=mm/dd/yyyy'
Devuelve todas las habitaciones que tengan disponibilidad en ese rango de fecha. Osea que no esten reservadas.
Vale aclarar, que puede haber pasado que una reserva haya pasado de estar reservada a eliminada, en este caso, la habitación aparecerá disponible para reservar, como debería ser.

recurso '/?enter=mm/dd/yyyy&exit=mm/dd/yyyy&beds=<number>&has_fridge=<boolen>&bathrooms=<number>'

Devolverá las habitaciones que estén disponibles para reservar dentro del rango que se elige junto con las coindiciones indicadas, cantidad de camas,si tiene heladera y cantidad de baños. 
REITERO, NO SE PUEDE FILTRAR SOLO POR CAMAS O SOLO POR BAÑOS O SOLO POR HELADERA. 

recurso '/availability/:id/'
Posibles querys dentro del endpoint:
Enter y exit (igual que en anterior)
Devolverá la habitación con las reservas ya incluídas si es posible reservar, sino devolverá que ya está reservado.

recurso '/:id/'
Devuelve el detalle de un cuarto específico con sus reservas y nada más.

## POST 
recurso '/'
Para crear una habitación se deben pasar por body los siguientes parametros:
beds,bathrooms,has_fridge.

## PUT
recurso ':/id/'
Se pueden pasar por body los mismos parámetros que en el post y se actualizarán 

## DELETE
recurso ':/id'
Elimina un cuarto. Devuelve un estado 204.

## COMENTARIOS EXTRA

Desde ya, agradecer la extensión del plazo de entrega. Esta semana fue muy complicada para mi en lo laboral ya que fue un sprint que no pude cumplirlo en mi trabajo actual. Hace mucho no usaba NODEJS y como cambié mi SO a Ubuntu debí instalar o aprender a utilizar las versiones de nuevo en mi nueva PC. Me costó mucho hacer el challenge  (TARDÉ 1 DÍA ENTERO EN HACER TODO ESTO. COMENCÉ VIERNES 15 HS Y TERMINÉ SÁBADO 17 HS) Sé que no es un código eficiente y que tiene fallas pero me voy a descansar un poco y disfrutar el fin de semana también. 

NO AGREGUÉ LA CONFIGURACIÓN DE DOCKER PORQUE NO SÉ COMO HACERLO EN PRINCIPIO, TRABAJÉ SIEMPRE EN AMBIENTES PREPARADOS.