const { request, response } = require('express');
const Profile = require('../models/profile_model');
const View = require('../models/view_model');
const Ad = require('../models/ad_model');

const getHistorial = async ( req = request, res = response ) => {
    try {
        const { user } = req;
        const { page } = req.params;
        const profile = await Profile.findOne({ user : user._id });
        if ( !profile ) {
            return res.status(404).json({ msg : 'No se pudo mostrar el historial.' });
        }
        const historial = await View.find({ visiter: profile._id }).populate('ad');
        const query = {
            state: true,
            visible: true,
            id: {
                $in: historial
            }
        }
        const options = {
            page,
            limit: process.env.PAGE_SIZE,
            select: 'title main_page createdAt category score publisher',
            sort: {
                createdAt: -1
            },
            populate: 'main_page'
        };
        const ads = await Ad.paginate(query,options);
        res.status(200).json({
            historial: ads.docs,
            totalRows: ads.docs.length
        });
        res.status(200).json({
            msg: 'Notificación enviada con exito'
        });
        
        
    } catch (error) {
        console.log(' CONTROLLER GET HISTORIAL -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const removeHistorialTotal = async ( req = request, res = response ) => {
    try {
        const { user } = req;
        const profile = await Profile.findOne({ user : user._id });
        if ( !profile ) {
            return res.status(404).json({ msg : 'No se pudo mostrar el historial.' });
        }
        const historial = [];
        const profileUpdated = await Profile.findByIdAndUpdate( profile._id ,{
            historial
        });
        if ( !profileUpdated ) {
            return res.status(404).json({ msg : 'No se pudo actualizar el historial.' });
        }
        res.status(200).json({
            msg: 'Historial eliminado con exito'
        });
    } catch (error) {
        console.log(' CONTROLLER REMOVE HISTORIAL TOTAL -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

module.exports = {
    addAdHistorial,
    getHistorial,
    removeHistorialTotal
}