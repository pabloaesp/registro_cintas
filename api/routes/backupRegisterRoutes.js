'use strict'

var express = require('express');
var backupRegisterController = require('../controllers/BackupRegisterController');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');


// Rutas
api.post('/backup-register', md_auth.ensureAuth, backupRegisterController.saveBackupRegister );
api.get('/get-register/:page?', md_auth.ensureAuth, backupRegisterController.getBackupRegisters );
api.post('/backup-update/:id', md_auth.ensureAuth, backupRegisterController.updateRegisterBackup );
api.delete('/backup-delete/:id', md_auth.ensureAuth, backupRegisterController.deleteBackupRegister );

module.exports = api;