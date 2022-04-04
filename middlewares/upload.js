// * Llamado de las dependencias
const { request, response } = require('express');
const multer = require('multer');

// * Llamado de los modelos
const Upload = require('../models/upload');

// * Llamado de los helpers
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
    try {
        const { type } = req.body;
        switch (type) {
            case 'ad':
                if ( req.files && req.files.length > 0 ) {
                    let idsUploads = [];
                    for ( let i = 0; i < req.files.length; i++ ) {
                        const uploadSave = organizeImage( req.files[i] );
                        const newUpload = new Upload( uploadSave );
                        const uploadCreated = await newUpload.save();
                        idsUploads.push( uploadCreated._id );
                    }
                    req.images = idsUploads;
                    next();
                } else {
                    return res.status(400).json({
                        msg: 'El anuncio debe tener mas de una imagen'
                    });
                }
                break;
            case 'profile':
                if ( req.file ) {
                    const upload = organizeImage( req.file );
                    const newUpload = new Upload(upload);
                    const uploadCreated = await newUpload.save();
                    req.image = uploadCreated._id;
                    next();
                }
                break;
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