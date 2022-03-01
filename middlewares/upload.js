const { request, response } = require('express');
const { organizeImage } = require('../helpers/uploads');
const Upload = require('../models/upload');

saveImages = async (req = request, res = response, next) => {
    try {
        if( req.files && req.files.length > 0 ) {
            let idsUpload = [];
            for (let i = 0; i < req.files.length; i++) {
                const upload = organizeImage( req.files[i] );
                const newUpload = new Upload(upload);
                const uploadCreated = await newUpload.save();
                idsUpload.push( uploadCreated._id );
                req.images = idsUpload;
            }
            next();
        } else if ( req.file ) {
            const upload = organizeImage( req.file );
            const newUpload = new Upload(upload);
            const uploadCreated = await newUpload.save();
            req.image = uploadCreated._id;
            next();
        } else {
            return res.status(401).json({
                msg: 'Debe tener una imagen para el anuncio'
            });
        }
    } catch (error) {
        console.log("error -->", error);
        return res.status(401).json({
            msg: 'No existe imagenes para el anuncio'
        });
    }
}


module.exports = {
    saveImages
};