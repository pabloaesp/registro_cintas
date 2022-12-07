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
            tape.status = false;
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


function getTapes(req, res){

    var itemsPerPage = 3;
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    Tape.find().sort('status').paginate(page, itemsPerPage, (err, tapes, total) => {
        if(err) res.status(500).send({message: 'Error en la peticion'});

        if(!tapes) return res.status(404).send({message: 'No hay cintas disponibles'});

        return res.status(200).send({
            tapes,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });
}


function getAvalibleTapes(req, res){

    Tape.find({status: false}).sort('status').exec((err, avalibleTapes) => {
        if(err) res.status(500).send({message: 'Error en la peticion'});

        if(!avalibleTapes) return res.status(404).send({message: 'No hay cintas disponibles'});

        return res.status(200).send({ avalibleTapes});
    });
}


function getTape(req, res){
    var tapeId = req.params.id;

    Tape.findById(tapeId, (err, tape) => {
        if(err) res.status(500).send({message: 'Error en la peticion'});
        
        if(!tape) return res.status(404).send({message: 'La cinta no existe'});

        return res.status(200).send({tape: tape});
        
    });
}


function tapeUpdate(req, res){
    var tapeId = req.params.id;

    var update = req.body;

    // Borro los dos valores criticos porque uno no se edita y el otro se maneja en otra funcion
    delete update.number;
    delete update.status;
    
    Tape.findByIdAndUpdate(tapeId, update, {new:true}, (err, tapeUpdated) => {
        if(err) res.status(500).send({message: 'Error en la peticion'});

        if(!tapeUpdated) return res.status(404).send({message: 'No se ha podido actualizar la cinta.'});

        return res.status(200).send({tape: tapeUpdated});

    });
}


function tapeStatusUpdate(req, res){
    var tapeId = req.params.id;

    var status = req.body.status;
    
    Tape.findByIdAndUpdate(tapeId, {status:status}, {new:true}, (err, tapeStatusUpdated) => {
        if(err) res.status(500).send({message: 'Error en la peticion'});
        
        if(!tapeStatusUpdated) return res.status(404).send({message: 'No se ha podido actualizar el status de la cinta.'});
        
        return res.status(200).send({tape: tapeStatusUpdated});

    });
}


function deleteTape(req, res){
    var tapeId = req.params.id;

    Tape.findOne({'_id': tapeId}, (err, tape) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        
        if(tape == null) return res.status(404).send({message: 'La cinta no existe.'});

        if(tape){
            Tape.deleteOne({'_id': tapeId}, (err, tapeRemoved) => {
                if(err) return res.status(500).send({message: 'Error al borrar la cinta'});
        
                if (tapeRemoved) return res.status(200).send({message: 'Cinta eliminada correctamente.'});        
            });
        }
    });
    
}


module.exports = {
    tapeRegister,
    getTapes,
    getAvalibleTapes,
    getTape,
    tapeUpdate,
    tapeStatusUpdate,
    deleteTape
}