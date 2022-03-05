const { request, response } = require('express');
const Ad = require('../models/ad');
const { deleteUploads } = require('../helpers/uploads');
const { searchProfile } = require('../helpers/profile');
const Rating = require('../models/rating');
const { makePagination } = require('../helpers/ads');


// puntos positivos
// fecha de publicación

const getAds = async( req = request, res = response ) => {
    try {
        const { pageValue, sortValue, sortDirection, filter, pageSize } = req.body;
        const page = {
            number: pageValue,
            size: pageSize
        };
        const sort = {
            value : sortValue,
            direction: sortDirection
        };
        const ads = await makePagination(page, sort, {} , filter );
        const totalRow = ads.length;
        res.status(200).json({
            totalRow,
            ads 
        });
    } catch (error) {
        console.log(` ERROR CONTROLLER GET ADS --> ${error} `)
        return res.status(500).json({
            msg: 'No se pueden visualizar los anuncios'
        })
    }
}

const getAdsByCategory = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const { pageValue, sortValue, sortDirection, filter, pageSize } = req.body;
        const page = {
            number: pageValue,
            size: pageSize
        };
        const sort = {
            value : sortValue,
            direction: sortDirection
        };
        const condition = {
            key : 'publisher',
            value : id
        };
        const ads = await makePagination(page, sort, condition, filter );
        const totalRow = ads.length;
        res.status(200).json({
            totalRow,
            ads 
        });
    } catch (error) {
        console.log(` ERROR CONTROLLER GET ADS CATEGORY --> ${error} `)
        return res.status(500).json({
            msg: 'No se pueden visualizar los anuncios'
        })
    }
}

const getAdsByPublisher = async ( req = request, res = response) => {
    try {
        const { id } = req.params;
        const { pageValue, sortValue, sortDirection, filter, pageSize } = req.body;
        const page = {
            number: pageValue,
            size: pageSize
        };
        const sort = {
            value : sortValue,
            direction: sortDirection
        };
        const condition = {
            key : 'publisher',
            value : id
        };
        const ads = await makePagination(page, sort, condition, filter );
        const totalRow = ads.length;
        res.status(200).json({
            totalRow,
            ads 
        });
    } catch (error) {
        console.log(` ERROR CONTROLLER GET ADS PUBLISHER --> ${error} `)
        return res.status(500).json({
            msg: 'No se pueden visualizar los anuncios'
        })
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
        const adsDelete = await Ad.findByIdAndUpdate(id, { state: false });
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
        const options = ['like', 'dislike'];
        const isOptionValidate = options.find( opt => opt == choice )
        if ( !isOptionValidate ) {
            return res.status(400).json({
                msg: 'Escoja una opción valida'
            });
        }
        const ad = await Ad.findById( id );
        if ( !ad ) {
            return res.status(400).json({
                msg: 'No se encontro el anuncio'
            });
        } else {
            if( ad.rating ) {
                const rating = await Rating.findById( ad.rating );
                if ( !rating ) {
                    return res.status(400).json({
                        msg: 'No se pudo registrar su votación'
                    });
                }
                choice == 'like' 
                ? rating.positive_points++ 
                : rating.negative_points++
                rating.score = rating.positive_points - rating.negative_points;
                const ratingUpdated = await Rating.findByIdAndUpdate( rating._id, {
                    score: rating.score,
                    positive_points: rating.positive_points,
                    negative_points: rating.negative_points
                });
                if ( !ratingUpdated ) {
                    return res.status(400).json({
                        msg: 'No se pudo registrar su votación'
                    });
                } 
                return res.status(200).json({
                    msg: 'Voto registrado con exito'
                });
            } else {
                let positive_points = 0;
                let negative_points = 0;
                const newRating = new Rating();
                choice == 'like'
                ? positive_points++
                : negative_points++
                let score = positive_points - negative_points;
                newRating.positive_points = positive_points;
                newRating.negative_points = negative_points;
                newRating.score = score;
                const savedRating = await newRating.save();
                if ( !savedRating ) {
                    return res.status(400).json({
                        msg: 'No se pudo registrar su votación'
                    });
                }
                const updatedAd = await Ad.findByIdAndUpdate( ad._id, {
                    rating: savedRating._id
                });
                if( !updatedAd ) {
                    return res.status(400).json({
                        msg: 'No se pudo registrar su votación'
                    });
                }
                return res.status(200).json({
                    msg: 'Voto registrado con exito'
                });
            }
        }
    } catch (error) {
        console.log( 'error -->', error);
        return res.status(500).json({
            msg: 'No se pudo registrar su votación'
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
    manageRating,
    getAdsByCategory
}