// * Importación de las dependencias
const { request, response } = require("express");

// * Importación de los modelos
const Profile = require('../models/profile_model');
const Ad = require('../models/ad_model');
const User = require('../models/user_model');
const { searchProfile } = require('../helpers/profile_helper');

// * Controlador para ver el perfil
const getProfile = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const { user } = req;
        const idProfile  = id || await searchProfile( user );
        const profile = await Profile.findById( idProfile ).populate('image');
        const userEmail = await User.findById(user).select('email');
        if ( !profile ) {
            return res.status(404).json({ msg : 'No se encontro el perfil.' });
        }
        res.status(200).json({
            profile,
            email: userEmail.email
        });
    } catch (error) {
        return res.status(500).json({ msg : 'No se encontro el perfil.' });
    }
}

// * Controlador para actualizar el perfil de usuario
const updateProfile = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const { name, cellphone, email , description, city } = req.body;
        const { user } = req;
        const { image } = req;
        const updatedProfile = await Profile.findByIdAndUpdate( id, {
            name, cellphone, description, user : user._id, image , city
        });
        const updatedUser = await User.findOneAndUpdate(user,{
            email
        });
        
        if ( !updatedProfile || !updatedUser ) {
            return res.status(404).json({ msg : 'No se pudo actualizar el perfil.' });
        }
        res.status(200).json({ msg: 'Perfil actualizado con exito'
        });
    } catch (error) {
        return res.status(500).json({ msg : 'No se encontro el perfil.' });
    }
}

//* Controlador para calcular el rating del perfil
const calculateRatingProfile = async ( req = request, res = response ) => {
    try {
        const { idProfile } = req.body;
        const profile = await Profile.findById( idProfile );
        if ( !profile ) {
            return res.status(404).json({ msg : 'No se pudo calcular la califación del usuario.' });
        } 
        const ads = await Ad.find({ publisher: profile._id });
        const publications = ads.length;
        let points_positive = 0;
        let points_negative = 0;
        ads.forEach(element => {
            points_positive += element.positive_points;
            points_negative += element.negative_points;
        });
        const score = points_positive - points_negative;
        const calification = points_positive + points_negative;
        const profileUpdated = await Profile.findByIdAndUpdate( profile._id ,{
            score
        });
        if ( !profileUpdated ) {
            return res.status(404).json({ msg : 'No se pudo calcular la califación del usuario.' });
        }
        res.status(200).json({ 
            publications,
            calification,
            score
        });
    } catch (error) {
        return res.status(500).json({ msg : `No se pudo calcular la califación del usuario. ${error}` });
    }
}


module.exports = {
    getProfile,
    updateProfile,
    calculateRatingProfile
}