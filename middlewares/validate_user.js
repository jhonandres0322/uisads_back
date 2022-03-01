const { request, response } = require('express');
const User = require('../models/user');
const Profile = require('../models/profile');


const isEmailExists = async ( email = '' ) => {
    const existsEmail = await User.findOne({ email });
    if( existsEmail ) {
        throw new Error(`El correo ${email} ya existe en la base de datos`);
    }
}

const isUserExists = async ( req = request, res = response, next ) => {
    const userExist = await User.findById(req.user.id);
    if ( !userExist ) {
        res.status(401).json({
            msg: 'No se pudo crear el perfil. Usuario no encontrado'
        });
    }
    next();
}

const isProfileExists = async ( req = request, res = response, next ) => {
    const profileExist = await Profile.findOne({
        user: req.user._id
    });
    if( profileExist ) {
        return res.status(401).json({
            msg: 'Ya posee un perfil'
        });
    }
    next();
}

module.exports = {
    isEmailExists,
    isUserExists,
    isProfileExists
}