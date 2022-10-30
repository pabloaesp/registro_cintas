'use strict'

var express = require('express');
var UserController = require('../controllers/userController');

var api = express.Router();


// Rutas
api.get('/home', UserController.home);


module.exports = api;