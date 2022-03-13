// * Llamado del modelo
const Ad = require('../models/ad');

// * Función para generar la paginación en los anuncios
// * Tambien sirve para filtrar los anuncios y buscar por cierta condición
const makePagination = async ( page = { }, sort = {}, condition = { }, filter = { } ) => {
    const ads = await Ad.find({
        [condition.key]: condition.value,
        state: true,
        [filter.key]: new RegExp(filter.value, 'i')
    })
    .populate('publisher')
    .populate('rating')
    .populate('category')
    .sort({ [ sort.value ] : sort.direction })
    .skip(( page.number - 1 ) * page.size )
    .limit( page.size );
    if ( !ads ) {
        return false;
    }
    return ads;
}

module.exports = {
    makePagination
}