'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

//Conexion database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/registro_cintas', { useNewUrlParser:true, useUnifiedTopology: true })
    .then(() => {
        console.log("BD Ok!");

        // //Crear servidor
        app.listen(port, () => {
            console.log("Server Ok!");
        });
    })
    .catch(err => console.log(err));

