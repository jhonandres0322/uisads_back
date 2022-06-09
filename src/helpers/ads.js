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
    .populate('category')
    .sort({ [ sort.value ] : sort.direction })
    .skip(( page.number - 1 ) * page.size )
    .limit( page.size );
    if ( !ads ) {
        return false;
    }
    return ads;
}

const updatePointsAd = async (choice, ad, type) => {

    ad.positive_points = ad.positive_points ;
    ad.negative_points = ad.negative_points ;
    if ( type == 'update' ) {
        if ( choice == 'like' ) {
            ad.positive_points++;
            ad.negative_points--;
        } else {
            ad.positive_points--;
            ad.negative_points++;
        }
    } else {
        choice == 'like'
        ? ad.positive_points++
        : ad.negative_points++
    }
    ad.score = ad.positive_points - ad.negative_points;
    const updateAd = await Ad.findByIdAndUpdate({
        _id: ad._id
    },{
        score: ad.score,
        positive_points: ad.positive_points,
        negative_points: ad.negative_points
    });
    if (!updateAd) {
        return false;
    } else  {
        return true;
    }
}

module.exports = {
    makePagination,
    updatePointsAd
}