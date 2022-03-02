const Ad = require('../models/ad');
const Rating = require('../models/rating');


const searchRatingByAd = async ( id ) => await Rating.findById(id)

const createNewRating = async ( idAd, choice = '' ) => {
    let ptsPositive = 0;
    let ptsNegative = 0;
    switch (choice) {
        case 'like':
            ptsPositive++;
            break;
        case 'dislike':
            ptsNegative++;
            break;
        default:
            return false;
    }
    let score = ptsPositive - ptsPositive;
    const newRating = new Rating({
        score,
        positive_points: ptsPositive,
        negative_points: ptsNegative
    });
    const savedRating = await newRating.save();
    if(!savedRating){
        return false; 
    }
    const ad = await Ad.findByIdAndUpdate(idAd,{
        rating: savedRating
    });
    if (!ad) {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    searchRatingByAd,
    createNewRating
}