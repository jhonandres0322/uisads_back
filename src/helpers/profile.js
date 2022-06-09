// * Llamado de las depedencias
const res = require('express/lib/response')

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

module.exports = {
    searchProfile
}