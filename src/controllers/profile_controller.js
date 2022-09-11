// * Importación de las dependencias
const { request, response } = require("express");

// * Importación de los modelos
const Profile = require('../models/profile_model');
const Ad = require('../models/ad_model');
const User = require('../models/user_model');
const { searchProfile } = require('../helpers/profile_helper');

// * Controlador para ver el perfil
const getProfile = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const { user } = req;
        const idProfile  = id || await searchProfile( user );
        const profile = await Profile.findById( idProfile ).populate('image');
        const userEmail = await User.findById(user).select('email');
        if ( !profile ) {
            return res.status(404).json({ msg : 'No se encontro el perfil.' });
        }
        res.status(200).json({
            profile,
            email: userEmail.email
        });
    } catch (error) {
        return res.status(500).json({ msg : 'No se encontro el perfil.' });
    }
}

// * Controlador para actualizar el perfil de usuario
const updateProfile = async ( req = request, res = response ) => {
    try {
        const { id } = req.params;
        const { name, cellphone, email , description, city } = req.body;
        const { user } = req;
        const { image } = req;
        const updatedProfile = await Profile.findByIdAndUpdate( id, {
            name, cellphone, description, user : user._id, image , city
        });
        const updatedUser = await User.findOneAndUpdate(user,{
            email
        });
        
        if ( !updatedProfile || !updatedUser ) {
            return res.status(404).json({ msg : 'No se pudo actualizar el perfil.' });
        }
        res.status(200).json({ msg: 'Perfil actualizado con exito'
        });
    } catch (error) {
        return res.status(500).json({ msg : 'No se encontro el perfil.' });
    }
}

//* Controlador para calcular el rating del perfil
const calculateRatingProfile = async ( req = request, res = response ) => {
    try {
        const { idProfile } = req.body;
        const profile = await Profile.findById( idProfile );
        if ( !profile ) {
            return res.status(404).json({ msg : 'No se pudo calcular la califación del usuario.' });
        } 
        const ads = await Ad.find({ publisher: profile._id, visible: true, state: true });
        const publications = ads.length;
        let points_positive = 0;
        let points_negative = 0;
        ads.forEach(element => {
            points_positive += element.positive_points;
            points_negative += element.negative_points;
        });
        const score = points_positive - points_negative;
        const calification = points_positive + points_negative;
        const profileUpdated = await Profile.findByIdAndUpdate( profile._id ,{
            score
        });
        if ( !profileUpdated ) {
            return res.status(404).json({ msg : 'No se pudo calcular la califación del usuario.' });
        }
        res.status(200).json({ 
            publications,
            calification,
            score
        });
    } catch (error) {
        return res.status(500).json({ msg : `No se pudo calcular la califación del usuario. ${error}` });
    }
}

const addAdHistorial = async ( req = request, res = response ) => {
    try {
        
    } catch (error) {
        console.log(' CONTROLLER ADD AD HISTORIAL -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const getHistorial = async ( req = request, res = response ) => {
    try {
        
    } catch (error) {
        console.log(' CONTROLLER GET HISTORIAL -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const sendNotifications = async ( req = request, res = response ) => {
    try {
        
    } catch (error) {
        console.log(' CONTROLLER SEND NOTIFICATIONS -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
} 

const manageNotifications = async ( req = request, res = response ) => {
    try {
        
    } catch (error) {
        console.log(' CONTROLLER DISABLED NOTIFICATIONS -->', error );
        return res.status(500).json({
            msg: 'No se pudo ingresar al aplicativo'
        });
    }
}

const saveAdFavorite = async ( req = request, res = response ) => {
    try {
        const { id } = req.body;
        const { user } = req;
        const profile = await Profile.findOne({ user: user._id });
        profile.favorites.push(id);
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
        const profile = await Profile.findOne({ user: user._id });
        if ( !profile ) {
            return res.status(404).json({ msg : 'No se pudo obtener los anuncios favoritos.' });
        }
        const favorites = profile.favorites;
        const query = {
            state: true,
            visible: true,
            id: {
                $in: favorites
            }
        }
        const options = {
            page: pageValue,
            limit: process.env.PAGE_SIZE,
            select: 'title main_page createdAt category score publisher',
            sort,
            populate: 'main_page'
        };
        const ads = await Ad.paginate(query,options);
        res.status(200).json({
            favorites: ads.docs,
            totalRows: ads.docs.length
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
        const { ad } = req.body;
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
    getProfile,
    updateProfile,
    calculateRatingProfile,
    addAdHistorial,
    getHistorial,
    sendNotifications,
    manageNotifications,
    saveAdFavorite,
    getFavorites,
    deleteFavorite
}