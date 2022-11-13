'use strict'

var moment = require('moment');

var Backup = require('../models/backupModel');
var BackupRegister = require('../models/backupRegisterModel');
var User = require('../models/userModel');
var Tape = require('../models/tapeModel');

// BACKUP se refiere al tipo de backup: Lunes full, Sabado VMs, Jueves Correo  sus detalles
// REGISTERBACKUP se refiere al registro del backup que contiene backup, user, tape...

function saveBackupRegister(req, res){
    var body = req.body;
    
    var backupData = new BackupRegister();
    
    backupData.user = req.user.sub;
    backupData.backup = body.backup;
    backupData.tape = body.tape;
    backupData.note = body.note;
    backupData.start_date = moment().unix();
    // END.DATE* Se gestiona abajo
    backupData.status = true

    BackupRegister.findOne({status: true}, (err, backup) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if (backup) {
            return res.status(500).send({message: 'Hay un respaldo en proceso!'})

        }else{
            // VALIDACIONES

            // TIPO BACKUP: Busco el tipo de BACKUP y asigno el END_DATE*
            Backup.findById({"_id": req.body.backup}, (err, data) => {
                if (err) return res.status(500).send({message: 'Error en la peticion'});

                if (!data) return res.status(404).send({message: 'El campo Cinta, es obligatorio'});

                if (data) {
                    var hours = data.process_time; 
                    // Seteando END_DATE*
                    backupData.end_date = moment().add(hours, 'hours').unix();
                    // var date = new Date(backup.end_date*1000);
                }
            });

            // TAPE: Comprobando que la TAPE a utilizar no este en uso
            Tape.findById({_id: backupData.tape}, (err, tapeUsed) => {
                if (err) return res.status(500).send({message: 'Error en la peticion'});

                if (tapeUsed.status == true) {
                    return res.status(500).send({message: 'La cinta seleccionada ya esta en uso.'});

                }else{
                    // SAVE: salvo la data validada del registro del backup
                    backupData.save((err, backupDataSaved) => {
                        if (err) return res.status(500).send({message: 'Error al guardar el registro'});

                        if (!backupDataSaved) return res.status(404).send({message: 'No se ha guardado el registro.'});

                        return res.status(200).send({register: backupDataSaved});
                    });
                        
                    // UPDATE STATUS: actualizo el estado de la cinta usada una vez se haya guardado el registro
                    updateStatus(backupData.tape, true);
                }
            });
        }
    });
}



function updateRegisterBackup(req, res){
    var registerId = req.params.id;
    var params = req.body;

    params.start_date = moment().unix();

    // Borro el status porque se gestiona en una funcion aparte
    delete params.status;

    // Validando que el respaldo no haya finalizado
    BackupRegister.findById({_id: registerId}).populate('tape backup').exec((err, backupRegister) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
       
        // Actualizo END_DATE* segun tipo de backup. 
        // Se hace aca porque al popular el backup ya tengo los datos del mismo y puedo conseguir el process_time
        var hours = backupRegister.backup.process_time; 
        // Seteando END_DATE*
        params.end_date = moment().add(hours, 'hours').unix();

        // Validando que el respaldo no este finalizado
        if(backupRegister.status != true) return res.status(500).send({message: 'No se puede modificar un respaldo finalizado.'});
        
        // Validando que la nueva cinta, no este en uso
        Tape.findById({_id: params.tape}, (err, tape) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});

            var tapeStatus = tape.status;
            var oldTapeStatus = backupRegister.tape;
            if (tapeStatus == true && tapeStatus != oldTapeStatus){
                return res.status(500).send({message: 'No se puede elegir una cinta en uso.'});
            }

            // Actualizo el status de la cinta que ya no se va a usar
            // updateStatus(oldTapeStatus, false);
        });

        // Actualizo el registro
        BackupRegister.findByIdAndUpdate(registerId, params, {new:true}, (err, registerUpdated) => {
            if(err) res.status(500).send({message: 'Error en la peticion'});
    
            if(!registerUpdated) return res.status(404).send({message: 'No se ha podido actualizar el registro.'});
    
            // Actualizo el status de la nueva cinta
            // updateStatus(params.tape, true);

            return res.status(200).send({register: registerUpdated});
    
        });
    });
}      


// Actualiza el status de las cintas
async function updateStatus(tapeId, status){
   var response = await Tape.findByIdAndUpdate(tapeId, {status: status}, {new:true}).exec().then((statusUpdated) => {
        return statusUpdated;

    }).catch((err) => {
        handleError(err);
    });

    return {
        tape: response
    }
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
    updateRegisterBackup,
    updateStatus,
    deleteBackupRegister
}
