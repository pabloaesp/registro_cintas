'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TapeSchema = Schema({
    number: String,
    description: String,
    place: String,
    status: Boolean
});

module.exports = mongoose.model('Tape', TapeSchema);