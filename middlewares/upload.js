const { request, response } = require('express');
const multer = require('multer');
const { organizeImage } = require('../helpers/uploads');
const Upload = require('../models/upload');


const storage = multer.diskStorage({
    destination: ( req, file, cb ) => {
        cb( null, './uploads');
    },
    filename: ( req, file, cb ) => {
        const filename = file.originalname.toLowerCase().split(' ').join('-');
        cb( null, filename );
    }
})

const upload = multer({
    storage
});

saveImages = async (req = request, res = response, next) => {
        const url = req.baseUrl.toString();
        if ( url.includes('ad') ) {
            if( req.files && req.files.length > 0 ) {
                let idsUpload = [];
                for (let i = 0; i < req.files.length; i++) {
                    const upload = organizeImage( req.files[i] );
                    console.log('content ->', upload.content.length);
                    const newUpload = new Upload(upload);
                    const savedUpload = await newUpload.save();
                    if( !savedUpload ) {
                        return res.status(400).json({
                            msg: 'No se pudo guardar los adjuntos'
                        });
                    }
                    idsUpload.push( savedUpload._id );
                    req.images = idsUpload;
                }
                next();
            } else {
                return res.status(401).json({
                    msg: 'El anuncio debe tener dos imagenes'
                });
            }
        } else {
            if ( req.file ) {
                const upload = organizeImage( req.file );
                const newUpload = new Upload(upload);
                const uploadCreated = await newUpload.save();
                req.image = uploadCreated._id;
            }
            next();
        }
    // try {
    //     const url = req.baseUrl.toString();
    //     if ( url.includes('ad') ) {
    //         if( req.files && req.files.length > 0 ) {
    //             let idsUpload = [];
    //             for (let i = 0; i < req.files.length; i++) {
    //                 const upload = organizeImage( req.files[i] );
    //                 const newUpload = new Upload(upload);
    //                 const uploadCreated = await newUpload.save();
    //                 idsUpload.push( uploadCreated._id );
    //                 req.images = idsUpload;
    //             }
    //             next();
    //         } else {
    //             return res.status(401).json({
    //                 msg: 'El anuncio debe tener dos imagenes'
    //             });
    //         }
    //     } else {
    //         if ( req.file ) {
    //             const upload = organizeImage( req.file );
    //             const newUpload = new Upload(upload);
    //             const uploadCreated = await newUpload.save();
    //             req.image = uploadCreated._id;
    //         }
    //         next();
    //     }
    // } catch (error) {
    //     console.log("Error Middleware saveImages -->", error);
    //     return res.status(401).json({
    //         msg: 'No existe imagenes para el anuncio'
    //     });
    // }
}


module.exports = {
    saveImages,
    upload
};