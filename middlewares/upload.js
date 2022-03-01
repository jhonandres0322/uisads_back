const { request, response } = require('express');
const Upload = require('../models/upload');

saveImagesAd = async (req = request, res = response, next) => {
    try {
        if( req.files.length > 0 ) {
            let idsUpload = [];
            for (let i = 0; i < req.files.length; i++) {
                const content = req.files[i].buffer;
                const fileNameParts = req.files[i].originalname.split('.');
                const name = fileNameParts[0];
                const type = fileNameParts[1];
                const newUpload = new Upload({
                    content,
                    name,
                    type
                });
                const uploadCreated = await newUpload.save();
                idsUpload.push( uploadCreated._id );
                req.images = idsUpload;
            }
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
    saveImagesAd
};