'use strict'

var express = require('express');
var TapeController = require('../controllers/tapeController');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');


// Rutas
api.post('/tape-register', md_auth.ensureAuth, TapeController.tapeRegister );

module.exports = api;