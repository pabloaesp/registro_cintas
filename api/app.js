'use strict'

const express = require('express');
var bodyParser = require('body-parser');

var app = express();


//cargar rutas
var user_routes = require('./routes/userRoutes');
var tape_routes = require('./routes/tapeRoutes');
var backup_routes = require('./routes/backupRegisterRoutes');
var backupTypes_routes = require('./routes/backupRoutes');


//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// configurar cabeceras http
// DEBE ESTAR PRIMERO QUE LAS RUTAS PARA PODER TRABAJAR CON LOS HEADERS Y PETICIONES GET, POST, PUT, ETC.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});    


//rutas
app.use('/api', user_routes);
app.use('/api', tape_routes);
app.use('/api', backup_routes);
app.use('/api', backupTypes_routes);


//exports
module.exports = app;