'use strict'

var moment = require('moment');

var Backup = require('../models/backupModel');
var BackupRegister = require('../models/backupRegisterModel');
var User = require('../models/userModel');
var Tape = require('../models/tapeModel');

function saveBackupRegister(req, res){
    var params = req.body;
    
    var backupData = new BackupRegister();
    
    backupData.user = req.user.sub;
    backupData.backup = params.backup;
    backupData.tape = params.tape;
    backupData.note = params.note;
    backupData.start_date = moment().unix();
    backupData.end_date = moment().add(7, 'days').unix();
    backupData.status = true

    console.log(backupData);

    backupData.save((err, backupDataSaved) => {
        if(err) return res.status(500).send({message: 'Error al guardar el registro'});

        if(!backupDataSaved) return res.status(404).send({message: 'No se ha guardado el registro'});

        return res.status(200).send({backup: backupDataSaved});


        // ARREGLAR: 
        // Si la cinta ya esta en uso, impedir guardar.
        // Si hay un backup del mismo tipo en curso, impedir guardar.
        // 

    });
    


}



module.exports = {
    saveBackupRegister
}