const { request, response } = require('express');
const Profile = require('../models/profile_model');
const Ad = require('../models/ad_model');


const saveAdFavorite = async ( req = request, res = response ) => {
    try {
        const { ad } = req.body;
        const { user } = req;
        const profile = await Profile.findOne({ user: user._id });
        const index = profile.favorites.indexOf(ad);
        if ( index > -1 ) {
            return res.status(400).json({ msg: 'El anuncio ya esta en favoritos' });
        }
        profile.favorites.push(ad);
        const profileUpdated = await Profile.findByIdAndUpdate( profile._id ,{
            favorites: profile.favorites
        });
        if ( !profileUpdated ) {
            return res.status(404).json({ msg : 'No se pudo guardar el anuncio en favoritos.' });
        }
        res.status(200).json({
            msg: 'Anuncio guardado en favoritos'
        });
    } catch (error) {
        console.log(' CONTROLLER DISABLED NOTIFICATIONS -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const getFavorites = async ( req = request, res = response ) => { 
    try {
        const { user } = req;
        const { page } = req.params;
        const profile = await Profile.findOne({ user: user._id });
        if ( !profile ) {
            return res.status(404).json({ msg : 'No se pudo obtener los anuncios favoritos.' });
        }
        const favorites = profile.favorites;
        const query = {
            state: true,
            visible: true,
            _id: {
                $in: favorites
            }
        }
        const options = {
            page,
            limit: process.env.PAGE_SIZE,
            select: 'title main_page createdAt category score publisher',
            sort: {
                createdAt: -1
            },
            populate: 'main_page'
        };
        const ads = await Ad.paginate(query,options);
        res.status(200).json({
            totalRows: ads.docs.length,
            favorites: ads.docs
        });
    } catch (error) {
        console.log(' CONTROLLER GET FAVORITES -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const deleteFavorite = async ( req = request, res = response ) => {
    try {
        const { user } = req;
        const { ad } = req.params;
        const profile = await Profile.findOne({ user: user._id });
        if ( !profile ) {
            return res.status(404).json({ msg : 'No se pudo eliminar el anuncio de favoritos.' });
        }
        const index = profile.favorites.indexOf(ad);
        if ( index > -1 ) {
            profile.favorites.splice(index,1);
        }
        const profileUpdated = await Profile.findByIdAndUpdate( profile._id ,{
            favorites: profile.favorites
        });
        if ( !profileUpdated ) {
            return res.status(404).json({ msg : 'No se pudo eliminar el anuncio de favoritos.' });
        }
        res.status(200).json({
            msg: 'Anuncio eliminado de favoritos'
        });
    } catch (error) {
        console.log(' CONTROLLER DELETE FAVORITE -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}


module.exports = {
    saveAdFavorite,
    getFavorites,
    deleteFavorite
}