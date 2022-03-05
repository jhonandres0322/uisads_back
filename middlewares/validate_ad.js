const Ad = require('../models/ad');
const Profile = require('../models/profile');

const validateAdExists = async (id) => {
    const ad = await Ad.findById(id);
    if(!ad){
        throw new Error('No existe el anuncio');
    }
}

const validateOwnerAd = async ( req = request, res = response, next ) => {
    const profile = await Profile.findOne({ user: req.user._id });
    if ( !profile ) {
        return res.status(400).json({
            msg: 'No tiene permisos para realizar la acción'
        });
    }
    const ad = await Ad.findOne({ publisher: profile._id, _id : req.params.id });
    if ( !ad ) {
        return res.status(400).json({
            msg: 'No tiene permisos para realizar la acción'
        });
    }
    next();
}

module.exports = {
    validateAdExists,
    validateOwnerAd
}