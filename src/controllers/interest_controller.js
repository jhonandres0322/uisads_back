const { request, response } = require('express');
const Profile = require('../models/profile_model');

const createInterest = async ( req = request, res = response ) => {
    try {
        const { interests } = req.body;
        const { user } = req;
        console.log('INTERESTS -->', interests);
        const profileUpdated = await Profile.findOneAndUpdate(
            { user: user._id }, { interests }
        );
        if( !profileUpdated ){
            return res.status(400).json({
                msg: 'No se pudo actualizar el perfil'
            });
        }
        return res.status(200).json({
            msg: 'Intereses actualizados con exito'
        });
    } catch (error) {
        console.log(' CONTROLLER CREATE INTEREST  -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const getInterests = async ( req = request, res = response ) => {
    try {
        const { user } = req;
        const profile = await Profile.findOne({ user: user._id });
        if( !profile ){
            return res.status(400).json({
                msg: 'No se pudo obtener los intereses'
            });
        }
        return res.status(200).json({
            interests: profile.interests
        });
    } catch (error) {
        console.log(' CONTROLLER GET INTERESTS  -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const removeInterests = async ( req = request, res = response ) => {
    try {
        const { user } = req;
        const profileUpdated = await Profile.findOneAndUpdate(
            { user: user._id }, { interests: [] }
        );
        if( !profileUpdated ){
            return res.status(400).json({
                msg: 'No se pudo actualizar el perfil'
            });
        }
        return res.status(200).json({   
            msg: 'Intereses eliminados con exito'
        });
    } catch (error) {
        console.log(' CONTROLLER GET INTERESTS  -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

module.exports = {
    createInterest,
    getInterests,
    removeInterests
}