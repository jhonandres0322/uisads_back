const { request, response } = require("express");
const Profile = require('../models/profile');


const createProfile = async (req = request, res = response ) => {

    try {
        const { name, cellphone, city } = req.body;
        const { user } = req;
        const { image } = req;
        const newProfile = new Profile({
            name,
            cellphone,
            city,
            user: user._id,
            image
        });
        const savedProfile = await newProfile.save();
        if( !savedProfile ) {
            return res.status(400).json({
                msg: 'No se pudo crear el perfil'
            });
        }
        res.status(200).json({
            msg: 'Perfil creado con exito',
            profile: savedProfile
        });
    } catch (error) {
        console.log('Controller Create Profile Error -->', error);
        return res.status(500).json({
            msg: 'No se pudo crear el perfil'
        })
    }
}


module.exports = {
    createProfile
}