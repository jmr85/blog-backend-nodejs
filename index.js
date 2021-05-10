'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true })
    .then(() => {
        console.log('La conexion a la base de datos correcta!!!!');
        //crear  servidor y ponerme a escuchar peticiones HTTP
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });//le pasamos dos param, 1 el puerto y el 2do un callback  para que dentro se ejecute lo quiere hacer en este caso un conole.log()
    });

