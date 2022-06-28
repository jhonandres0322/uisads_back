// * Llamado de las dependencias
const { request, response } = require("express");

// * Llamado de los modelos
const Profile = require('../models/profile');
const Ad = require('../models/ad');
const { errorHandler } = require("../helpers/error_handler");

let msg;
let errors;

// * Controlador para ver el perfil
const getProfile = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findById( id )
                                    .populate('image')
                                    .populate('rating');
        if ( !profile ) {
            msg = 'No se encontro el perfil';
            errors = errorHandler( msg );
            return res.status(404).json({ errors });
        }
        res.status(200).json({
            profile
        });
    } catch (error) {
        console.log('ERROR CONTROLLER GET PROFILE -->', error);
        msg = 'No se pudo crear el perfil';
        errors = errorHandler( msg );
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
            msg = 'No se pudo crear el perfil';
            errors = errorHandler( msg );
            return res.status(400).json({
                msg: 'No se pudo crear el perfil'
            });
        }
        res.status(200).json({
            msg: 'Perfil actualizado con exito'
        });
    } catch (error) {
        console.log('ERROR CONTROLLER UPDATE PROFILE -->', error);
        msg = 'No se pudo actualizar el perfil';
        errors = errorHandler( msg );
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
            msg = 'No se pudo calcular la califación del usuario';
            errors = errorHandler( msg );
            return res.status(400).json({ errors });
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
            msg = 'No se pudo generar la calificación';
            errors = errorHandler( msg );
            return res.status(400).json({ errors });
        }
        res.status(200).json({
            msg: 'Calificación calculada con exito'
        })
    } catch (error) {
        console.log('Controller Calculate Rating Profile Error -->', error);
        msg = 'No se pudo calcular la calificación del usuario';
        errors = errorHandler( msg );
        return res.status(500).json({ errors })
    }
}

const addAdHistorial = async ( req = request, res = response ) => {
    try {
        
    } catch (error) {
        console.log(' CONTROLLER ADD AD HISTORIAL -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const getHistorial = async ( req = request, res = response ) => {
    try {
        
    } catch (error) {
        console.log(' CONTROLLER GET HISTORIAL -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const sendNotifications = async ( req = request, res = response ) => {
    try {
        
    } catch (error) {
        console.log(' CONTROLLER SEND NOTIFICATIONS -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
} 

const disabledNotifications = async ( req = request, res = response ) => {
    try {
        
    } catch (error) {
        console.log(' CONTROLLER DISABLED NOTIFICATIONS -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

module.exports = {
    getProfile,
    updateProfile,
    calculateRatingProfile,
    addAdHistorial,
    getHistorial,
    sendNotifications,
    disabledNotifications
}