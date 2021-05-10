'use strict'
//1. Cargar modulos de node para crear el servidor.
var express = require('express');
var bodyParser = require('body-parser');
//2. Ejecutar express (http)
var app = express();
//3. Cargar ficheros rutas
var article_routes = require('./routes/article');

//4. Middlewares (es algo que se ejecuta antes de cargar una ruta o una url de la app) Si yo me creo un midleware para unas rutas ese mddleware se va a ejecutar antes. Voyy poder usar el que viene con express para que procese un dato ante sde ejecutar la ruta como tal
app.use(bodyParser.urlencoded({extended:  false}));
app.use(bodyParser.json());//otro middleware convertir mediante parser cualquier tipo de peticion a json
//5. Activar el CORS para permitir peticiones desde el frontend.

//6. Añadir prefijos a las rutas / Cargar rutas
app.use('/api',article_routes);

//7. Añadir una ruta o metodo de prueba para el API REST

// metodo get tiene dos param, 1ro la ruta en si, 2do param es una funcion callback...para hacer algo con esa ruta, ese callback recibe dos param, 1er req y 2do el resp
// la req son los param que recibo y el resp lo que devuelvo  

//8. Exporta el modulo (el archivo actual) para poder usarlo fuera y poder cargar el app.js en el index.js y ahi poder largar el servidor a escuchar.
module.exports = app;//esto me va a permitir usar el objeto que acabo de crear fuera de este archivo