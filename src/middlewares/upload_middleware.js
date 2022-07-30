// * Importación de las dependencias
const { request, response } = require('express');

// * Importación de los modelos
const Upload = require('../models/upload_model');
const Profile = require('../models/profile_model');
// * Importación de los helpers
const { organizeImage } = require('../helpers/upload_helper');

// * Middleware para guardar las imagenes en la base de datos
const saveImages = async (req = request, res = response, next) => {
    const body =  req.body
    const images = JSON.parse( body.images );
    try {
        if ( images && images.length > 0 ) {
            let idsUploads = [];
            for ( let i = 0; i < images.length; i++ ) {
                const uploadSave = organizeImage( images[i] );
                const newUpload = new Upload( uploadSave );
                const uploadCreated = await newUpload.save();
                idsUploads.push( uploadCreated._id );
            }
            req.images = idsUploads;
            next();
        } else {
            return res.status(400).json({
                msg: 'El anuncio debe tener una imagen o más'
            });
        }
    } catch (error) {
        return res.status(401).json({
            msg: 'No existe imagenes para el anuncio'
        });
    }
}

const saveImageProfile = async (req = request, res = response, next) => {
    const body =  req.body;
    const image = JSON.parse( body.image );
    try {
        if ( image.content.length > 0 ) {
            const previousImageProfile = await Profile.findOne({
                user: req.user._id
            })
            if( !previousImageProfile ) {
                return res.status(404).json({
                    msg: 'No se pudo actualizar el perfil'
                });
            }
            const idUpload = previousImageProfile.image;
            await Upload.findByIdAndDelete( idUpload );
            const uploadSave = organizeImage( image );
            const newUpload = new Upload( uploadSave );
            const uploadCreated = await newUpload.save();
            idImage = uploadCreated._id
            req.image = idImage;
        }
        next();
    } catch (error) {
        return res.status(401).json({
            msg: 'No se pudo actualizar el perfil'
        });
    }
}

module.exports = {
    saveImages,
    saveImageProfile
};