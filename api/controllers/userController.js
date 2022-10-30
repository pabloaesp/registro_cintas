'use strict'

var User = require('../models/user');

// var jwt = require('../services/jwt');

function home(req, res) {
    res.status(200).send({message: 'Respondiendo desde Home'});
}

module.exports = {
    home
}