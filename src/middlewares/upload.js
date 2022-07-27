// * Importación de las dependencias
const { request, response } = require('express');
const multer = require('multer');

// * Importación de los modelos
const Upload = require('../models/upload');

// * Importación de los helpers
const { organizeImage } = require('../helpers/uploads');

// * Middleware para generar el storage del multer
const storage = multer.diskStorage({
    destination: ( req, file, cb ) => {
        cb( null, process.env.PATH_UPLOAD );
    },
    filename: ( req, file, cb ) => {
        const filename = file.originalname.toLowerCase().split(' ').join('-');
        cb( null, filename );
    }
})

// * Middleware para generar la instancia de multer en el servidor
const upload = multer({ storage });

// * Middleware para guardar las imagenes en la base de datos
const saveImages = async (req = request, res = response, next) => {
    const body =  req.body
    const images = JSON.parse( body.images );
    try {
        if ( images && images.length > 0 ) {
            let idsUploads = [];
            for ( let i = 0; i < images.length; i++ ) {
                console.log('index -->', i);
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
        console.log("Error Middleware saveImages -->", error);
        return res.status(401).json({
            msg: 'No existe imagenes para el anuncio'
        });
    }
}

module.exports = {
    saveImages,
    upload
};