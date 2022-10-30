'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BackupSchema = Schema({
    name: String,
    description: String,
    type: String,
    user: { type: Schema.ObjectId, ref: 'User' },
    periodicity: String,
    date: String,
    server: String,
    status: String,
    save_time: String,
});

module.exports = mongoose.model('Backup', BackupSchema);