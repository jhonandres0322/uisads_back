const Ad = require('../models/ad');


const validateAdExists = async (id) => {
        const ad = await Ad.findById(id);
        if(!ad){
            throw new Error('No existe el anuncio');
        }
}

module.exports = {
    validateAdExists
}