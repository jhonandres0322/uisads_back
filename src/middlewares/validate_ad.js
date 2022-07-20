// * Llamado de los modelos
const Ad = require('../models/ad');
const Profile = require('../models/profile');
const Category = require('../models/category');

// * Llamdo de los helpers
const { errorHandler } = require('../helpers/error_handler');

let msg;
let errors;

// * Middleware para validar si existe un anuncio por id
const validateAdExists = async (id) => {
    const ad = await Ad.findById(id);
    if(!ad){
        throw new Error('No existe el anuncio');
    }
}

// * Middleware para validar si el perfil es el dueño del anuncio
const validateOwnerAd = async ( req = request, res = response, next ) => {
    const profile = await Profile.findOne({ user: req.user._id });
    if ( !profile ) {
        return res.status(404).json({ errors : errorHandler( 'No tiene permisos para realizar la acción' ) });
    }
    const ad = await Ad.findOne({ publisher: profile._id, _id : req.params.id });
    if ( !ad ) {
        return res.status(404).json({ errors : errorHandler( 'No tiene permisos para realizar la acción' ) });
    }
    next();
}

// * Middleware para validar si existe la categoria
const validateCategoryExists = async ( id ) => {
    const category = await Category.findById( id );
    if ( !category ) {
        throw new Error('No existe la categoria');
    }
}

module.exports = {
    validateAdExists,
    validateOwnerAd,
    validateCategoryExists
}