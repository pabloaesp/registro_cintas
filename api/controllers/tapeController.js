'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Tape = require('../models/tapeModel');

function tapeRegister(req, res){
    var params = req.body;
    
    if(!params.number) return res.status(500).send({message: 'Debe ingresar el numero de cinta'});
    
    Tape.find({number: params.number}, (err, tape) =>{
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if (tape && tape.length >= 1) {
            return res.status(200).send({message: 'El numero de cinta ya existe.'});

        }else{
            var tape = new Tape();

            tape.number = params.number;
            tape.description = params.description;
            tape.status = params.status;
            tape.place = params.place;

            tape.save((err, tapeStored) => {
                if(err) return res.status(500).send({message: 'Error en la peticion.'});

                if(tapeStored){
                    res.status(200).send({tape: tapeStored});
                }else{
                    res.status(404).send({message: 'No se ha registrado la cinta'});
                }
            });
        }
    });
}



module.exports = {
    tapeRegister
}