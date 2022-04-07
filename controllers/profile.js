// * Llamado de las dependencias
const { request, response } = require("express");

// * Llamado de los modelos
const Profile = require('../models/profile');
const Ad = require('../models/ad');
const ad = require("../models/ad");

// * Controlador para ver el perfil
const getProfile = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findById( id )
                                    .populate('image')
                                    .populate('rating');
        if ( !profile ) {
            return res.status(404).json({
                msg: 'No se encontro el perfil'
            });
        }
        res.status(200).json({
            profile
        });
    } catch (error) {
        console.log('ERROR CONTROLLER GET PROFILE -->', error);
        return res.status(500).json({
            msg: 'No se pudo crear el perfil'
        })
    }
}

// * Controlador para crear perfil
const createProfile = async (req = request, res = response ) => {
    try {
        const { name, cellphone } = req.body;
        const { user } = req;
        const { image } = req;
        const newProfile = new Profile({
            name,
            cellphone,
            user: user._id,
            image
        });
        const savedProfile = await newProfile.save();
        if( !savedProfile ) {
            return res.status(404).json({
                msg: 'No se pudo crear el perfil'
            });
        }
        res.status(200).json({
            msg: 'Perfil creado con exito',
            profile: savedProfile
        });
    } catch (error) {
        console.log('ERROR CONTROLLER CREATE PROFILE -->', error);
        return res.status(500).json({
            msg: 'No se pudo crear el perfil'
        })
    }
}

// * Controlador para actualizar el perfil de usuario
const updateProfile = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const { name, cellphone } = req.body;
        const { user } = req;
        const { image } = req;
        const updatedProfile = await Profile.findByIdAndUpdate( id, {
            name, cellphone, user : user._id, image 
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
        console.log('ERROR CONTROLLER UPDATE PROFILE -->', error);
        return res.status(500).json({
            msg: 'No se pudo actualizar el perfil'
        })
    }
}

//* Controlador para calcular el rating del perfil
const calculateRatingProfile = async ( req = request, res = response ) => {
    try {
        const { user } = req;
        const profile = await Profile.findOne({ user });
        if ( !profile ) {
            return res.status(400).json({
                msg: 'No se pudo calcular la calificación del usuario'
            });
        } 
        const ads = await Ad.find({ publisher: profile._id });
        let points_positive = 0;
        let points_negative = 0;
        ads.forEach(element => {
            points_positive += element.positive_points;
            points_negative += element.negative_points;
        });
        const score = points_positive - points_negative;
        const profileUpdated = await Profile.findOneAndUpdate({user},{
            score
        });
        if ( !profileUpdated ) {
            return res.status(400).json({
                msg: 'No se pudo generar la calificación'
            });
        }
        res.status(200).json({
            msg: 'Calificación calculada con exito'
        })
    } catch (error) {
        console.log('Controller Calculate Rating Profile Error -->', error);
        return res.status(500).json({
            msg: 'No se pudo calcular la calificación del usuario'
        })
    }
}


module.exports = {
    createProfile,
    getProfile,
    updateProfile,
    calculateRatingProfile
}