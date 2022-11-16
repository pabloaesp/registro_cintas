'use strict'

var moment = require('moment');

var Backup = require('../models/backupModel');
var BackupRegister = require('../models/backupRegisterModel');
var User = require('../models/userModel');
var Tape = require('../models/tapeModel');

// BACKUP se refiere al tipo de backup: Lunes full, Sabado VMs, Jueves Correo  sus detalles
// REGISTERBACKUP se refiere al registro del backup que contiene backup, user, register...

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
        if(err) return res.status(500).send({message: 'Error en la peticion 1'});

        if (backup) {
            return res.status(500).send({message: 'Ya hay un respaldo en proceso!'})

        }else{
            // VALIDACIONES

            // TIPO BACKUP: Busco el tipo de BACKUP y asigno el END_DATE*
            Backup.findById({"_id": req.body.backup}, (err, data) => {
                if (err) return res.status(500).send({message: 'Error en la peticion 2'});

                if (!data) return res.status(404).send({message: 'El campo Cinta, es obligatorio'});

                if (data) {
                    var hours = data.process_time; 
                    // Seteando END_DATE*
                    backupData.end_date = moment().add(hours, 'hours').unix();
                    // var date = new Date(backup.end_date*1000);
                
                    // TAPE: Comprobando que la TAPE a utilizar no este en uso
                    Tape.findById({_id: backupData.tape}, (err, tapeUsed) => {
                        console.log(tapeUsed);
                        if (err) return res.status(500).send({message: 'Error en la peticion 3'});

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
    });
}


function getBackupRegisters(req, res){

    var itemsPerPage = 3;
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    BackupRegister.find().sort('start_date').paginate(page, itemsPerPage, (err, registers, total) => {
        if(err) res.status(500).send({message: 'Error en la peticion'});

        if(!registers) return res.status(404).send({message: 'No registros disponibles'});

        return res.status(200).send({
            registers,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });
}


function updateRegisterBackup(req, res){
    var registerId = req.params.id;
    var body = req.body;

    // Borro propiedades que no se van a modificar
    delete body.user;
    delete body.status;
    
    // Actualizo fecha de inicio
    body.start_date = moment().unix();
    
    // Validando que el respaldo no haya finalizado
    BackupRegister.findById({_id: registerId}).populate('tape backup').exec((err, backupRegister) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
       
        if(backupRegister.status != true) {
            return res.status(500).send({message: 'No se puede modificar un respaldo finalizado.'});

        }else{
            // Validando que la nueva cinta, no este en uso
            Tape.findById({_id: body.tape}, (err, tape) => {
                if(err) return res.status(500).send({message: 'Error en la peticion'});

                var newTapeStatus = tape.status;
                var newTapeId = JSON.stringify(tape._id);
                var oldTapeId = JSON.stringify(backupRegister.tape._id);

                if (newTapeStatus == true && newTapeId != oldTapeId){
                    return res.status(500).send({message: 'La cinta seleccionada ya esta en uso.'});

                }else{
                    // Actualizo END_DATE* segun tipo de backup. 
                    var hours = backupRegister.backup.process_time; 
                    // Seteando END_DATE*
                    body.end_date = moment().add(hours, 'hours').unix();
                    
                    // Actualizo el registro
                    BackupRegister.findByIdAndUpdate(registerId, body, {new:true}, (err, registerUpdated) => {
                        if(err) res.status(500).send({message: 'Error en la peticion'});
                
                        if(!registerUpdated) return res.status(404).send({message: 'No se ha podido actualizar el registro.'});

                        return res.status(200).send({register: registerUpdated});
                    });

                    // Actualizo el status de la cintas solo si difiere la nueva a actualizar de la nueva ya existente
                    if (newTapeId != oldTapeId ) {
                        updateStatus(tape._id, true); // Cinta nueva
                        updateStatus(backupRegister.tape._id, false); // Cinta vieja
                    }
                }
            });
        }
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


// HACER FUNCIONES GET DE REGISTRO, BACKUP Y CINTAS
function deleteBackupRegister(req, res){
    var registerId = req.params.id;

    BackupRegister.findById({_id: registerId}).exec((err, register) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(register == null){
            return res.status(404).send({message: 'El respaldo no existe.'});

        }else if (register.status == false){
            return res.status(404).send({message: 'No se puede eliminar un respaldo finalizado.'});

        }else{
            // Validacion del respaldo finalizado por fecha
            // var endDate = new Date(register.end_date*1000);
            // var diff = moment().diff(endDate, 'hours');
            // if(diff >= 0){
            //     return res.status(500).send({message: 'No se puede eliminar un respaldo ya finalizado.'});

            BackupRegister.deleteOne({'_id': registerId}, (err, registerRemoved) => {
                if(err) return res.status(500).send({message: 'Error al borrar la cinta'});
        
                if (registerRemoved) return res.status(200).send({message: 'Registro de respaldo eliminado correctamente.'});        
            });
            
            updateStatus(register.tape, false);

        }
    });
}


module.exports = {
    saveBackupRegister,
    getBackupRegisters,
    updateRegisterBackup,
    updateStatus,
    deleteBackupRegister
}
