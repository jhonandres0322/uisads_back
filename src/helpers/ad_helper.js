// * Importación del modelo
const Ad = require('../models/ad_model');
const Profile = require('../models/profile_model');
const View = require('../models/view_model');

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

const showFavoriteAd = async ( ad, user ) => {
    try {
        const profile = await  Profile.findOne({ user });
        if ( !profile ) return false;
        const favorites = profile.favorites;
        const isAdFavorite = favorites.find( favorite => JSON.stringify(favorite) == JSON.stringify(ad) );
        return isAdFavorite ? true : false;
    } catch (error) {
        return false;
    }
}

const addAdHistorial = async ( ad, user ) => {
    try {
        const profile = await Profile.findOne( {
            user: user._id
        })
        if ( !profile ) return false;
        const newView = new View({
            ad,
            visiter: profile._id
        });
        const viewSaved = await newView.save();
        if ( !viewSaved ) return false;
        const historial = profile.historial;
        historial.push(ad);
        const profileUpdated = await Profile.findByIdAndUpdate( profile._id ,{
            historial
        });
        if ( !profileUpdated ) return false;
        return true;
    } catch (error) {
        return "";
    }
}

module.exports = {
    updatePointsAd,
    createDateFilter,
    showFavoriteAd,
    addAdHistorial
}