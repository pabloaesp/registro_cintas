'use strict'

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

var User = require('../models/userModel');

// var jwt = require('../services/jwt');

function home(req, res) {
    res.status(200).send({message: 'Respondiendo desde Home'});
}


function registerUser(req, res){
    var params = req.body;
    var user = new User();

    console.log(params);

    if(params.name && params.surname && params.nick && params.password){

        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.password = params.password;
        user.role = 'ROLE_USER';
        user.image = null;

        // Query para comprobar si el usuario a registra ya no existe
        User.find({nick: user.nick.toLowerCase()}).exec((err, users) => {
            if(err) return res.status(500).send({message: 'Error en la peticion de usuarios'});

            // Compruebo que el nick/ID del usuario exista.
            if(users && users.length >= 1){
                return res.status(200).send({message: 'El usuario que intenta registrar ya existe.'});
            
            }else{

                // Encriptando contraseña
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    if(err){
                        return res.status(500).send({message: 'Error encriptando password'});
                    }else{
                        user.password = hash;
                    }

                    // Guardando el usuario despues de encriptar la password
                    user.save((err, userSaved) => {
                        if(err) return res.status(500).send({message: 'Error al guarda el usuario'});

                        if (userSaved) {
                            res.status(200).send({user: userSaved});
                        }else{
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }
                    });
                });
            }
        });

    }else{
        return res.status(200).send({message: 'Envia todos los campos necesarios!!'});
    }
}

function loginUser(req, res){
    var params = req.body;

    var nick = params.nick;
    var password = params.password;

    User.findOne({nick: nick}, (err, user) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if (user){
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if(params.gettoken){
                        // Generar token y devolver
                        return res.status(200).send({token: jwt.createToken(user)});

                    }else{
                        // Devolver datos del usuario
                        user.password = undefined;
                        return res.status(200).send({user});
                    }

                }else{
                    return res.status(404).send({message: 'Usuario o Contraseña incorrectos.'});
                }
            });

        }else{
            return res.status(404).send({message: 'Usuario o Contraseña incorrectos!'});
        }
    });
}


module.exports = {
    home,
    registerUser,
    loginUser
}