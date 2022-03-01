const { request, response } = require('express');
const Ad = require('../models/ad');
const fs = require('fs');
const path = require('path');


// puntos positivos
// fecha de publicación

// fecha de publicación

const getAds = async( req = request, res = response ) => {
    try {
        
    } catch (error) {
        
    }
}



const getAd = async( req = request, res = response ) => {
    try {
        
    } catch (error) {
        
    }
}

// TODO: El publisher debe venir del usuario logueado
// TODO: Las imagenes debe guardarse en el upload
const createAd = async( req = request, res = response ) => {
    const { title, description } = req.body;
    const { user } = req;
    const publisher = user._id;
    const { images } = req;
    try {
        const adNew = new Ad({
            title,
            description,
            publisher,
            images
        });
        const adSaved = await adNew.save();
        if( !adSaved ) {
            return res.status(500).json({
                msg: 'No se pudo guardar el anuncio'
            });
        }
        return res.status(200).json({
            msg: 'Se ha guardado el anuncio con exito'
        });
    } catch (error) {
        console.log( 'error -->', error);
        return res.status(200).json({
            msg: 'Se ha guardado el anuncio con exito'
        });
    }
}

const updateAd = async( req = request, res = response ) => {
    const { title, description } = req.body;
    const { id } = req.params;
    const { user } = req;
    try {
        
    } catch (error) {
        
    }
}

const deleteAd = async( req = request, res = response ) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = {
    createAd,
    updateAd
}