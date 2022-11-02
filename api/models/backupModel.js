'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Modelo del registro de los backups
var BackupSchema = Schema({
    name: String,
    description: String,
    type: String, //Incremental, Semanal, Mensual, Anual...
    save_time: String, // 1 semana, 4 semanas, 1 año...
});

module.exports = mongoose.model('Backup', BackupSchema);