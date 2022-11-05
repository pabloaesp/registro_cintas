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

    BackupRegister.findOne({"backup": req.body.backup}, (err, backup) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        // LA MANERA DE VALIDAR SI SE PUEDE REGISTRAR UN BACKUP ES POR EL STATUS
        // YA QUE HAY UNA SOLA CASETERA, POR LO TANTO SI HAY UN BACKUP EN TRUE NO SE PUEDE COLCAR OTRO
        // QUE CAMBIE DE ESTADO CUANDO: POR MEDIO DE UN BOTON TERMINAR QUE SI SE HACE ANTES DEL TIEMPO
        // DE GUARDADO TENGA CONFIRMACION O
        // CUANDO SE CAMBIE EL LUGAR DEL REGISTRO DEL BACKUP 

    });

    // // Buscando datos del tipo de Backup para validar si no hay uno de igual tipo en curso y el END_DATE* 
    // Backup.findById({"_id": req.body.backup}, (err, data) => {
    //     if(err) return res.status(500).send({message: 'Error en la peticion'});

    //     if (data) {
    //         var hours = data.process_time; 
    //         backupData.end_date = moment().add(hours, 'hours').unix(); // Seteando END_DATE*
        
    //         // SALVO la data validada del registro del backup
    //         backupData.save((err, backupDataSaved) => {
    //             if(err) return res.status(500).send({message: 'Error al guardar el registro'});
        
    //             if(!backupDataSaved) return res.status(404).send({message: 'No se ha guardado el registro'});
        
    //             return res.status(200).send({backup: backupDataSaved});
    //         });
    //     }
    // });

}



module.exports = {
    saveBackupRegister
}