// * Importación de las depedencias
const { request, response } = require('express');

// * Importación de los modelos
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
        const { name, cellphone, city } = req.body;
        const newProfile = new Profile({
            name,
            cellphone,
            user: user._id,
            city
        });
        const savedProfile = await newProfile.save();
        if ( !savedProfile ) {
            return res.status(404).json({ msg : 'No se pudo crear el perfil' });
        }
        return savedProfile;
    } catch (error) {
        return res.status(500).json({ msg : 'No se pudo crear el perfil' })
    }
}


module.exports = {
    searchProfile,
    createProfile
}