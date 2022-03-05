const { request, response } = require("express");
const Profile = require('../models/profile');


const getProfile = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findById( id )
                                    .populate('image');
        if ( !profile ) {
            return res.status(400).json({
                msg: 'No se encntro el perfil'
            });
        }
        res.status(200).json({
            profile
        });
    } catch (error) {
        console.log('Controller Get Profile Error -->', error);
        return res.status(500).json({
            msg: 'No se pudo crear el perfil'
        })
    }
}


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

const updateProfile = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const { name, cellphone, city } = req.body;
        const { user } = req;
        const { image } = req;
        const updatedProfile = await Profile.findByIdAndUpdate( id, {
            name, cellphone, city, user : user._id, image 
        });
        if ( !updatedProfile ) {
            return res.status(400).json({
                msg: 'No se pudo crear el perfil'
            });
        }
        res.status(200).json({
            msg: 'Perfil actualizado con exito'
        });
    } catch (error) {
        console.log('Controller Update Profile Error -->', error);
        return res.status(500).json({
            msg: 'No se pudo actualizar el perfil'
        })
    }
}


module.exports = {
    createProfile,
    getProfile,
    updateProfile
}