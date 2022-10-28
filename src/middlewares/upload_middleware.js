// * Importación de las dependencias
const { request, response, json } = require('express');

// * Importación de los modelos
const Upload = require('../models/upload_model');
const Profile = require('../models/profile_model');
const Ad = require('../models/ad_model');
// * Importación de los helpers
const { organizeImage } = require('../helpers/upload_helper');
const { off } = require('../models/upload_model');

// * Middleware para guardar las imagenes en la base de datos
const saveImages = async (req = request, res = response, next) => {
    try {
        const images = JSON.parse( req.body.images );
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
        return res.status(500).json({
            msg: `No existe imagenes para el anuncio ${error}`
        });
    }
}

const updateImages = async ( req= request, res= response, next ) => {
    const images = JSON.parse( req.body.images );
    const ad = await Ad.findById( req.params.id );
    const imagesAd =  ad.images;
    const idsUploads = [];
    try {
        if ( images && images.length > 0 ) {
            for ( const image of images ) {
                if( image._id ) {
                    idsUploads.push( image._id );
                } else {
                    const uploadSave = organizeImage( image );
                    const newUpload = new Upload( uploadSave );
                    const uploadCreated = await newUpload.save();
                    idsUploads.push( uploadCreated._id );
                }
            }
            for ( const image of imagesAd ) {
                const existUpload = idsUploads.find( (element) => {
                    return JSON.stringify( element ) == JSON.stringify( image );
                });
                if( !existUpload ) {
                    const uploadDeleted = await Upload.findByIdAndDelete( image );
                    if ( !uploadDeleted ) {
                        return res.status(400).json({
                            msg: 'No se pudo actualizar el anuncio'
                        });
                    }
                }
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
            msg: `No existe imagenes para el anuncio ${error}`
        });
    }
}

const saveImageProfile = async (req = request, res = response, next ) => {
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
    saveImageProfile,
    updateImages
};