// * Importación de las dependencias
const { request, response } = require('express');

// * Importación de los helpers
const { deleteUploads } = require('../helpers/upload_helper');
const { searchProfile } = require('../helpers/profile_helper');
const { makePagination, updatePointsAd, createDateFilter } = require('../helpers/ad_helper');

// * Importación de los modelos
const Ad = require('../models/ad_model');
const Profile = require('../models/profile_model');
const Vote = require('../models/vote_model');


// * Controlador para mostrar todos los anuncios
const getAds = async( req = request, res = response ) => {
    try {
        const { pageValue } = req.body;
        const page = {
            number: pageValue,
            size: process.env.PAGE_SIZE
        };
        const ads = await Ad.find({
            state: true,
            visible: true,
        })
        .sort('-createdAt')
        .select(' title main_page createdAt category')
        .populate('main_page')
        .skip(( page.number - 1 ) * page.size )
        .limit( page.size );
        const totalRows = ads.length;
        if ( !ads ) {
            return res.status(404).json({ msg : 'No se encontraron anuncios' });
        }
        res.status(200).json({ totalRows, ads });
    } catch (error ) {
        return res.status(500).json({  msg : `No se pueden visualizar los anuncios ${error}` });
    }
}


// * Controlador para mostrar los anuncios por categorias
const getAdsByCategory = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const { pageValue } = req.body;
        const page = {
            number: pageValue,
            size: process.env.PAGE_SIZE
        };
        const ads = await Ad.find({
            state: true,
            visible: true,
            category: id
        })
        .sort('-createdAt')
        .select(' title main_page createdAt category')
        .populate('main_page')
        .skip(( page.number - 1 ) * page.size )
        .limit( page.size );
        if ( !ads ) {
            return res.status(404).json({ msg : 'No se encontraron anuncios' });
        }
        const totalRows = ads.length;
        res.status(200).json({
            totalRows,
            ads 
        });
    } catch (error) {
        return res.status(500).json({  msg : `No se pueden visualizar los anuncios ${error}` })
    }
}

// * Controlador para mostrar los anuncios por publicador
const getAdsByPublisher = async ( req = request, res = response) => {
    try {
        const { id } = req.params;
        const { pageValue } = req.body;
        const page = {
            number: pageValue,
            size: process.env.PAGE_SIZE
        };
        const ads = await Ad.find({
            state: true,
            visible: true,
            publisher: id
        })
        .sort('-createdAt')
        .select(' title main_page createdAt category')
        .populate('main_page')
        .skip(( page.number - 1 ) * page.size )
        .limit( page.size );        
        const totalRows = ads.length;
        res.status(200).json({
            totalRows,
            ads 
        });
    } catch (error) {
        return res.status(500).json({ msg : 'No se encontraron anuncios' })
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
            return res.status(400).json({  msg :  'No se encontró el anuncio' });
        }
        res.status(200).json({
            ad
        });
    } catch (error) {
        return res.status(500).json({  msg :  'No se puede encontro el anuncio'  });
    }
}

// * Controlador para crear un anuncio
const createAd = async( req = request, res = response ) => {
    const { title, description, visible, category } = req.body;
    const { user, images } = req;
    try {
        const profile  = await searchProfile( user._id );
        if ( !profile ) {
            return res.status(404).json({  msg :  'No se encontro el perfil de usuario' });
        }
        const adNew = new Ad({
            title,
            description,
            visible,
            publisher: profile._id,
            images,
            category
        });
        const adSaved = await adNew.save();
        if( !adSaved ) {
            return res.status(500).json({  msg :  'No se pudo guardar el anuncio' });
        }
        return res.status(200).json({
            msg: 'Se ha guardado el anuncio con exito'
        });
    } catch (error) {
        return res.status(500).json({  msg :  `No se pudo guardar el anuncio --> ${error}` });
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
            return res.status(400).json({  msg :  'No se pudo actualizar el anuncio' });
        }
        res.status(200).json({
            msg: 'El anuncio se actualizo con exito'
        });
    } catch (error) {
        return res.status(500).json({  msg :  'No se pudo actualizar el anuncio'  });
    }
}

// * Controlador para eliminar un anuncio
const deleteAd = async( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const adsDelete = await Ad.findByIdAndUpdate(id, { state: false });
        if( !adsDelete.state ) {
            return res.status(400).json({  msg :  'El anuncio ya se ha borrado' });
        }
        const uploads = adsDelete.images;
        if ( !deleteUploads( uploads ) ) {
            return res.status(400).json({  msg :  'No se pudo eliminar el anuncio' });
        }
        res.status(200).json({ msg: 'Anuncio eliminado con exito' });
    } catch (error) {
        return res.status(500).json({  msg :  'No se pudo eliminar el anuncio' });
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
            return res.status(400).json({  msg :  'No es escogio un opción valida' });
        }
        const profile = await Profile.findOne({ user: user._id });
        if ( !profile ) {
            return res.status(400).json({  msg :  'No se encontro un perfil valido' });
        }
        const ad = await Ad.findById(id);
        if ( !ad ) {
            return res.status(400).json({  msg :  'No se encontro el anuncio' });
        } else {
            const vote = await Vote.findOne({
                voter: profile._id,
                ad: ad._id
            });
            let updatePoints;
            if ( vote ) {
                if ( vote.type == choice ) {
                    return res.status(400).json({ msg: 'No se pudo reaccionar al anuncio' });
                } else {
                    const voteUpdated = await Vote.findByIdAndUpdate(
                        vote._id,
                        { type: choice }
                    );
                    if ( !voteUpdated ) {
                        return res.status(400).json({ msg : 'No se pudo reaccionar al anuncio' });
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
                    return res.status(400).json({ msg : 'No se pudo reaccionar el anuncio' });
                }
                updatePoints = await updatePointsAd(choice, ad, 'new' );
            }
            if ( !updatePoints ) {
                return res.status(400).json({ msg : 'No se pudo reaccionar al anuncio' })
            }
            res.status(200).json({
                msg: 'Se ha calificado con exito'
            });
        }
    } catch (error) {
        return res.status(500).json({  msg :  'No se pudo reaccionar al anuncio' });
    }
}

// * Controlador para buscar anuncios
const searchAds = async ( req = request, res = response ) => {
    try {
        const { query } = req.params;
        const { publisher, time, category, order } = req.body;
        let orderAd = '';
        if( order ) {
            order.value == 'asc' ? orderAd = '+' : orderAd = '-'; 
            order.type == 'date' ? orderAd += 'createdAt' : orderAd += 'score';
        }
        let valueTime = '';
        if( time ) {
            valueTime = createDateFilter( time );
        }
        const ads = await Ad.find({
            $and: [
                { state: true },
                { visible: true },
                publisher == 'publisher'
                ? { publisher }
                : {},
                query != ' '
                ? {
                    $or:[
                        { title : new RegExp(query, 'i') },
                { title : new RegExp(query, 'i') }, 
                        { title : new RegExp(query, 'i') },
                        { description : new RegExp(query, 'i')},
                    ]
                }
                : {},
                valueTime
                ? { createdAt: { $gte: valueTime }  }
                : { },
                category
                ? { category }
                : { }
            ],
        })
        .sort( order ? orderAd : '-createdAt' );
        if ( !ads ) {
            return res.status(404).json({  msg : `No se encontraron resultados ` });
        }
        res.status(200).json({
            totalRows: ads.length,
            ads
        });
    } catch (error) {
        return res.status(500).json({  msg :  `No se encontraron anuncios ${error} ` });
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