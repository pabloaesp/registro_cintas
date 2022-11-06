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


function deleteBackupRegister(req, res){
    var registerId = req.params.id;

    Tape.findOne({'_id': registerId}, (err, register) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        
        if(register == null) return res.status(404).send({message: 'El respaldo no existe.'});

        if(tape){
            Tape.deleteOne({'_id': tapeId}, (err, tapeRemoved) => {
                if(err) return res.status(500).send({message: 'Error al borrar la cinta'});
        
                if (tapeRemoved) return res.status(200).send({message: 'Cinta eliminada correctamente.'});        
            });
        }
    });
    
}


module.exports = {
    saveBackupRegister
}