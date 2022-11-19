'use strict'

var express = require('express');
var backupController = require('../controllers/BackupController');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');


// Rutas
api.get('/backups/:page?', md_auth.ensureAuth, backupController.getBackups);
api.get('/backup/:id', md_auth.ensureAuth, backupController.getBackup);


module.exports = api;