const { request, response } = require('express');
const Ad = require('../models/ad');
const { deleteUploads } = require('../helpers/uploads');
const { searchProfile } = require('../helpers/profile');
const { searchRatingByAd, createNewRating } = require('../helpers/ad');


// puntos positivos
// fecha de publicación

// fecha de publicación

const getAds = async( req = request, res = response ) => {
    try {
        
    } catch (error) {
        
    }
}

const getAdsByPublisher = async ( req = request, res = response) => {
    try {
        
    } catch (error) {
        
    }
}

const getAd = async( req = request, res = response ) => {
    const { id } = req.params;
    try {
        const ad = await Ad.findById(id)
                            .populate('images')
                            .populate('publisher')
                            .populate('rating');
        if ( !ad ) {
            return res.status(400).json({
                msg: 'No se encontro el anuncio'
            })
        }
        res.status(200).json({
            ad
        });
    } catch (error) {
        console.log( 'error -->', error);
        return res.status(500).json({
            msg: 'No se puede visualizar el anuncio'
        });
    }
}

const createAd = async( req = request, res = response ) => {
    const { title, description } = req.body;
    const { user } = req;
    const { images } = req;
    try {
        const { id } = await searchProfile( user._id );
        const adNew = new Ad({
            title,
            description,
            publisher: id,
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
        return res.status(500).json({
            msg: 'No se pudo guardar el anuncio'
        });
    }
}

const updateAd = async( req = request, res = response ) => {
    const { title, description } = req.body;
    const { id } = req.params;
    try {
        const adUpdate = await Ad.findByIdAndUpdate(id,{
            title,
            description
        });
        if ( !adUpdate ) {
            return res.status(401).json({
                msg: 'No se pudo actualizar el anuncio'
            });
        }
        res.status(200).json({
            msg: 'El anuncio se actualizo con exito'
        });
    } catch (error) {
        console.log( 'error -->', error);
        return res.status(500).json({
            msg: 'No se pudo actualizar el anuncio'
        });
    }
}

const deleteAd = async( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const uploads = adsDelete.images;
        if ( !deleteUploads( uploads ) ) {
            return res.status(400).json({
                msg: 'No se pudo eliminar el anuncio'
            });
        }
        const adsDelete = await Ad.findByIdAndDelete(id);
        if( !adsDelete ) {
            return res.status(400).json({
                msg: 'No se pudo eliminar el anuncio'
            });
        }
        res.status(200).json({
            msg: 'Anuncio eliminado con exito'
        });
    } catch (error) {
        console.log( 'error -->', error);
        return res.status(500).json({
            msg: 'No se pudo eliminar el anuncio'
        });
    }
}

const manageRating = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const { choice } = req.body;
        const ad = await Ad.findById( id );
        if ( !ad ) {
            return res.status(400).json({
                msg: 'No se encontro el anuncio'
            });
        }
        if( ad.rating ) {
            const rating = searchRatingByAd( ad.rating );
            if ( !rating ) {
                const createRating = createNewRating(ad.id, choice);
                if ( !createRating ) {
                    return res.status(400).json({
                        msg: 'Problemas para agregar la calificación'
                    });
                } else {
                    return res.status(200).json({
                        msg: 'Su calificación ha sido registrada con exito'
                    });
                }
            }
        }
        
    } catch (error) {
        console.log( 'error -->', error);
        return res.status(500).json({
            msg: 'No se pudo eliminar el anuncio'
        });
    }
}


module.exports = {
    createAd,
    updateAd,
    deleteAd,
    getAd,
    getAdsByPublisher,
    getAds,
    manageRating
}