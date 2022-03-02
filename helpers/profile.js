const res = require('express/lib/response')
const Profile = require('../models/profile')


const searchProfile =  async ( idUser ) => {
    try {
        const profile = await Profile.findOne({
            user: idUser
        });
        if( !profile ) {
            return res.status(400).json({
                msg: 'No se encontro el perfil'
            });
        }
        return profile;
    } catch (error) {
        console.log(' HELPER SEARCH PROFILE ERROR -->', error );
        return res.status(500).json({
            msg: 'Problemas en encontrar el perfil'
        })
    }
}



module.exports = {
    searchProfile
}