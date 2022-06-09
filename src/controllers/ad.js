// * Llamado de las dependencias
const { request, response } = require('express');

// * Llamado de los helpers
const { deleteUploads } = require('../helpers/uploads');
const { searchProfile } = require('../helpers/profile');
const { makePagination, updatePointsAd } = require('../helpers/ads');
const { errorHandler } = require('../helpers/error_handler');

// * Llamado de los modelos
const Ad = require('../models/ad');
const Profile = require('../models/profile');
const Vote = require('../models/vote');

let msg;
let errors;

// * Controlador para mostrar todos los anuncios
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
        if ( !ads ) {
            msg = 'No se encontraron anuncios';
            errors = errorHandler(msg);
            return res.status(404).json({ errors });
        }
        res.status(200).json({ ads });
    } catch (error ) {
        console.log(` ERROR CONTROLER GET ADS --> ${error} `)
        msg = 'No se pueden visualizar los anuncios';
        errors = errorHandler(msg);
        return res.status(500).json({ errors });
    }
}


// * Controlador para mostrar los anuncios por categorias
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
            key : 'category',
            value : id
        };
        const ads = await makePagination(page, sort, condition, filter );
        if ( !ads ) {
            msg = 'No se encontraron anuncios';
            errors = errorHandler(msg);
            return res.status(404).json({ errors });
        }
        const totalRow = ads.length;
        res.status(200).json({
            totalRow,
            ads 
        });
    } catch (error) {
        console.log(` ERROR CONTROLLER GET ADS CATEGORY --> ${error} `)
        msg = 'No se pueden visualizar los anuncios';
        errors = errorHandler( msg );
        return res.status(500).json({ errors })
    }
}

// * Controlador para mostrar los anuncios por publicador
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
        if ( !ads ) {
            msg = 'No se encontraron anuncios';
            errors = errorHandler(msg);
            return res.status(404).json({ errors });
        }
        const totalRow = ads.length;
        res.status(200).json({
            totalRow,
            ads 
        });
    } catch (error) {
        console.log(` ERROR CONTROLLER GET ADS PUBLISHER --> ${error} `)
        msg = 'No se pueden visualizar los anuncios';
        errors = errorHandler(msg);
        return res.status(500).json({ errors })
    }
}

// * Controlador para mostrar un anuncio
const getAd = async( req = request, res = response ) => {
    const { id } = req.params;
    try {
        const ad = await Ad.findById(id)
                            .populate('images')
                            .populate('publisher');
        if ( !ad ) {
            msg = 'No se encontro el anuncio';
            errors = errorHandler( msg );
            return res.status(400).json({ errors });
        }
        res.status(200).json({
            ad
        });
    } catch (error) {
        console.log( 'ERROR CONTROLLER GET AD -->', error);
        msg = 'No se puede visualizar el anuncio';
        errors = errorHandler( msg );
        return res.status(500).json({ errors });
    }
}

// * Controlador para crear un anuncio
const createAd = async( req = request, res = response ) => {
    const { title, description, visible } = req.body;
    const { user } = req;
    const { images } = req;
    try {
        const profile  = await searchProfile( user._id );
        if ( !profile ) {
            msg = 'No se encontro el perfil de usuario';
            errors = errorHandler( msg );
            return res.status(404).json({ errors });
        }
        const adNew = new Ad({
            title,
            description,
            visible,
            publisher: profile._id,
            images
        });
        const adSaved = await adNew.save();
        if( !adSaved ) {
            msg = 'No se pudo guardar el anuncio';
            errors = errorHandler( msg ); 
            return res.status(500).json({ errors });
        }
        return res.status(200).json({
            msg: 'Se ha guardado el anuncio con exito'
        });
    } catch (error) {
        console.log( 'ERROR CONTROLLER CREATE AD -->', error);
        msg = 'No se pudo guardar el anuncio';
        errors = errorHandler( msg );
        return res.status(500).json({
            msg: 'No se pudo guardar el anuncio'
        });
    }
}

// * Controlador para actualizar un anuncio
const updateAd = async( req = request, res = response ) => {
    const { title, description, visible } = req.body;
    const { id } = req.params;
    try {
        const adUpdate = await Ad.findByIdAndUpdate(id,{
            title,
            description,
            visible
        });
        if ( !adUpdate ) {
            msg = 'No se pudo actualizar el anuncio';
            errors = errorHandler( msg );
            return res.status(400).json({ errors });
        }
        res.status(200).json({
            msg: 'El anuncio se actualizo con exito'
        });
    } catch (error) {
        console.log( 'ERROR CONTROLER UPDATE AD -->', error);
        msg = 'No se pudo actualizar el anuncio';
        errors = errorHandler( msg );
        return res.status(500).json({ errors });
    }
}

// * Controlador para eliminar un anuncio
const deleteAd = async( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const adsDelete = await Ad.findByIdAndUpdate(id, { state: false });
        if( !adsDelete.state ) {
            msg = 'El anuncio ya se ha borrado';
            errors = errorHandler( msg );
            return res.status(400).json({ errors });
        }
        const uploads = adsDelete.images;
        if ( !deleteUploads( uploads ) ) {
            msg = 'No se pudo eliminar el anuncio';
            errors = errorHandler( msg );
            return res.status(400).json({ errors });
        }
        res.status(200).json({
            msg: 'Anuncio eliminado con exito'
        });
    } catch (error) {
        console.log( 'ERROR CONTROLLER DELETE AD -->', error);
        msg = 'No se pudo eliminar el anuncio';
        errors = errorHandler( msg );
        return res.status(500).json({ errors });
    }
}

// * Controlador para gestionar las calificaciones de un anuncio
/**
* 
* @param {*} id: id del anuncio que se va calificar
* @param {*} choice: opción escogida por el usuario -> Opciones: Like o Dislike
*
*/
const manageRating = async ( req = request, res = response ) => {
    try {
        const { id } = req.params; 
        const { user } = req;
        const { choice } = req.body; 
        const options = ['like', 'dislike'];
        const isOptionValidate = options.find( opt => opt == choice )
        if ( !isOptionValidate ) {
            msg = 'No es escogio un opción valida';
            errors = errorHandler( msg );
            return res.status(400).json({ errors });
        }
        const profile = await Profile.findOne({ user: user._id });
        if ( !profile ) {
            msg = '';
            errors = errorHandler( msg )
            return res.status(400).json({ errors });
        }
        const ad = await Ad.findById(id);
        if ( !ad ) {
            msg = '';
            errors = errorHandler( msg )
            return res.status(400).json({ errors });
        } else {
            const vote = await Vote.findOne({
                voter: profile._id,
                ad: ad._id
            });
            let updatePoints;
            if ( vote ) {
                if ( vote.type == choice ) {
                    msg = '';
                    errors = errorHandler( msg )
                    return res.status(400).json({ errors })
                } else {
                    const voteUpdated = await Vote.findByIdAndUpdate(
                        vote._id,
                        { type: choice }
                    );
                    if ( !voteUpdated ) {
                        msg = '';
                        errors = errorHandler( msg )
                        return res.status(400).json({ errors });
                    }
                    updatePoints = await updatePointsAd(choice, ad, 'update' );
                }
            } else {
                const newVote = await Vote({
                    voter: profile._id,
                    ad: ad._id,
                    type: choice
                });
                const votedSaved = await newVote.save();
                if ( !votedSaved ) {
                    msg = '';
                    errors = errorHandler( msg )
                    return res.status(400).json({ errors });
                }
                updatePoints = await updatePointsAd(choice, ad, 'new' );
            }
            if ( !updatePoints ) {
                msg = '';
                errors = errorHandler( msg )
                return res.status(400).json({ errors })
            }
            res.status(200).json({
                msg: 'Se ha calificado con exito'
            });
        }
    } catch (error) {
        console.log( 'ERROR CONTROLLER MANAGE RATING -->', error);
        msg = '';
        errors = errorHandler( msg )
        return res.status(500).json({ errors });
    }
}

// * Controlador para buscar anuncios
const searchAds = async ( req = request, res = response ) => {
    try {
        const { query } = req.params;
        const ads = await Ad.find({
            $or: [
                { title : new RegExp(query, 'i') }, 
                { description : new RegExp(query, 'i')}
            ]
        });
        if ( !ads ) {
            msg = 'No se encontraron resultados';
            errors = errorHandler( msg );
            return res.status(404).json({ errors });
        }
        res.status(200).json({
            totalRows: ads.length,
            ads
        });
    } catch (error) {
        console.log('CONTROLLER SEARCH ADS -->', error);
        msg = 'No se encontraron anuncios';
        errors = errorHandler( msg );
        return res.status(500).json({ errors });
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
    getAdsByCategory,
    searchAds
}