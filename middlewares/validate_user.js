// * Llamado de las dependencias
const { request, response } = require('express');

// * Llamado de los modelos
const User = require('../models/user');
const Profile = require('../models/profile');

// * Middleware para validar si el usuario existe con ese email
const isEmailExists = async ( email = '' ) => {
    const existsEmail = await User.findOne({ email });
    if( existsEmail ) {
        throw new Error(`El correo ${email} ya existe en la base de datos`);
    }
}

// * Middleware para validar si el usuario ya existe en la base de datos
const isUserExists = async ( req = request, res = response, next ) => {
    const userExist = await User.findById(req.user.id);
    if ( !userExist ) {
        res.status(401).json({
            msg: 'No se pudo crear el perfil. Usuario no encontrado'
        });
    }
    next();
}

// * Middleware para validar si el perfil existe en la base de datos
// * En esta middleware se valida por usuario
const isProfileExists = async ( req = request, res = response, next ) => { 
    const profileExist = await Profile.findOne({ user: req.user.id });
    if( profileExist ) {
        return res.status(400).json({
            msg: 'Ya posee un perfil de usuario'
        });
    }
    next();
}

// * Middleware para validar si el perfil existe en la base de datos
// * En esta middleware se valida por id de perfil
const validateExistsProfile = async ( id ) => {
    const profile = await Profile.findById( id );
    if ( !profile ) {
        throw new Error('El perfil de usuario no existe');
    }
}

module.exports = {
    isEmailExists,
    isUserExists,
    isProfileExists,
    validateExistsProfile
}