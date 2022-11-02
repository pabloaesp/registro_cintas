'use strict'

var express = require('express');
var backupRegisterController = require('../controllers/BackupRegisterController');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');


// Rutas
api.post('/backup-register', md_auth.ensureAuth, backupRegisterController.saveBackupRegister );

module.exports = api;