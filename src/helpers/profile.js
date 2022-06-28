// * Llamado de las depedencias
const { request, response } = require('express');
const { errorHandler } = require("../helpers/error_handler");


// * Llamado de los modelos
const Profile = require('../models/profile')

// * Función para buscar el perfil por el id del usuario
const searchProfile =  async ( idUser ) => {
    const profile = await Profile.findOne({ user: idUser });
    if( !profile ) {
        return false;
    }
    return profile;
}

const createProfile = async ( req = request, res = response, user ) => {
try {
        const { name, cellphone } = req.body;
        const { image } = req;
        const newProfile = new Profile({
            name,
            cellphone,
            user: user._id,
            image
        });
        const savedProfile = await newProfile.save();
        return savedProfile;
    } catch (error) {
        console.log('ERROR CONTROLLER CREATE PROFILE -->', error);
        msg = 'No se pudo crear el perfil';
        errors = errorHandler( msg );
        return res.status(500).json({ errors })
    }
}


module.exports = {
    searchProfile,
    createProfile
}