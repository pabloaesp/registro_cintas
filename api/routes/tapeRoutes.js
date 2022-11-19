'use strict'

var express = require('express');
var TapeController = require('../controllers/tapeController');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');


// Rutas
api.post('/tape-register', md_auth.ensureAuth, TapeController.tapeRegister );
api.post('/tape-register', md_auth.ensureAuth, TapeController.tapeRegister );
api.get('/tapes/:page?', md_auth.ensureAuth, TapeController.getTapes);
api.get('/tape/:id', md_auth.ensureAuth, TapeController.getTape );
api.put('/tape-update/:id', md_auth.ensureAuth, TapeController.tapeUpdate );
api.put('/tape-status-update/:id', md_auth.ensureAuth, TapeController.tapeStatusUpdate );
api.delete('/delete-tape/:id', md_auth.ensureAuth, TapeController.deleteTape );

module.exports = api;