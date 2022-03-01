const Ad = require('../models/ad');


const validateAdExists = async (id) => {
    try {
        const ad = await Ad.findById(id);
        if(!ad){
            throw new Error('No existe el anuncio');
        }
    } catch (error) {
        throw new Error('Error al validar el anuncio');
    }
}

module.exports = {
    validateAdExists
}