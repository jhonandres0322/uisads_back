// * Importación del modelo
const Ad = require('../models/ad_model');

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

const createDateFilter = ( typeDate ) => {
    const dateNow = Date.now();
    let dateMiliseconds;
    switch (typeDate) {
        case '24h':
            dateMiliseconds = dateNow - ( 24 * 60 * 60 * 1000 );
            break;
        case '7d':
            dateMiliseconds = dateNow - ( 8 * 24 * 60 * 60 * 1000 );
            break;
        case '1m':
            dateMiliseconds = dateNow - ( 30 * 24 * 60 * 60 * 1000 );
            break;
        default:
            break;
    }
    let date = new Date( dateMiliseconds );
    return date;
}

module.exports = {
    updatePointsAd,
    createDateFilter
}