'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Modelo del registro de los backups
var BackupRegisterSchema = Schema({

    user: { type: Schema.ObjectId, ref: 'User' },
    backup: { type: Schema.ObjectId, ref: 'Backup' },
    tape: { type: Schema.ObjectId, ref: 'Tape' },
    note: String,
    start_date: String,
    end_date: String,
    status: Boolean
});

module.exports = mongoose.model('BackupRegister', BackupRegisterSchema);