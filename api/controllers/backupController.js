'use strict'

// var moment = require('moment');
// var mongoosePaginate = require('mongoose-pagination');

var Backup = require('../models/backupModel');

function getBackups(req, res){

    var itemsPerPage = 3;
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    Backup.find().sort('name').paginate(page, itemsPerPage, (err, backup, total) => {
        if(err) res.status(500).send({message: 'Error en la peticion'});

        if(!backup) return res.status(404).send({message: 'No hay backups disponibles'});

        return res.status(200).send({
            backup,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });
}


function getBackup(req, res){
    var backupId = req.params.id;

    Backup.findById(backupId, (err, backup) => {
        if(err) res.status(500).send({message: 'Error en la peticion'});
        
        if(!backup) return res.status(404).send({message: 'El backup no existe'});

        return res.status(200).send({backup: backup});
        
    });
}



module.exports = {
    getBackups,
    getBackup
}