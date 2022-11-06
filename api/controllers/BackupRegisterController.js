'use strict'

var moment = require('moment');

var Backup = require('../models/backupModel');
var BackupRegister = require('../models/backupRegisterModel');
var User = require('../models/userModel');
var Tape = require('../models/tapeModel');

function saveBackupRegister(req, res){

    // Backup se refiere al tipo de backup: Lunes full, Sabado VMs, Jueves Correo  sus detalles
    // BackupRegister se refiere al registro del backyp que contiene backup, user, tape...
    
    var params = req.body;
    
    var backupData = new BackupRegister();
    
    backupData.user = req.user.sub;
    backupData.backup = params.backup;
    backupData.tape = params.tape;
    backupData.note = params.note;
    backupData.start_date = moment().unix(); //COLOCAR UNIX A TODAS LAS FECHAS
    // END.DATE* Se gestiona abajo
    backupData.status = true

    BackupRegister.findOne({status: true}, (err, backup) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if (backup) {
            return res.status(500).send({message: 'Hay un respaldo en proceso!'})

        }else{
            // Asignando END_DATE* segun tipo de backup
            Backup.findById({"_id": req.body.backup}, (err, data) => {
                if(err) return res.status(500).send({message: 'Error en la peticion'});

                if (data) {
                    var hours = data.process_time; 
                    // Seteando END_DATE*
                    backupData.end_date = moment().add(hours, 'hours').unix();
                    // var date = new Date(backup.end_date*1000);
                
                    // SALVO la data validada del registro del backup
                    backupData.save((err, backupDataSaved) => {
                        if(err) return res.status(500).send({message: 'Error al guardar el registro'});
                
                        if(!backupDataSaved) return res.status(404).send({message: 'No se ha guardado el registro'});
                
                        return res.status(200).send({backup: backupDataSaved});
                    });
                }
            });
        }
    });
}



function updateRegisterBackup(req, res){
    var registerId = req.params.id;

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



function deleteBackupRegister(req, res){
    var registerId = req.params.id;

    BackupRegister.findOne({'_id': registerId}, (err, register) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(register == null){
            return res.status(404).send({message: 'El respaldo no existe.'});

        }else{
            // Validacion de que no se pueda borrar un registro de un respaldo que ya termino
            var endDate = new Date(register.end_date*1000);
            var diff = moment().diff(endDate, 'hours');
    
            if(diff >= 0){
                return res.status(500).send({message: 'No se puede eliminar un respaldo ya finalizado.'});
    
            }else{
                BackupRegister.deleteOne({'_id': registerId}, (err, registerRemoved) => {
                    if(err) return res.status(500).send({message: 'Error al borrar la cinta'});
            
                    if (registerRemoved) return res.status(200).send({message: 'Registro de respaldo eliminado correctamente.'});        
                });
                }
        }
    });
}


module.exports = {
    saveBackupRegister,
    deleteBackupRegister,
    updateRegisterBackup
}