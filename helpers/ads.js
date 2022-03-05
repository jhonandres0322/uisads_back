const Ad = require('../models/ad');

const makePagination = async ( page = { }, sort = {}, condition = { }, filter = { } ) => {
    console.log(' page -->', page);
    console.log(' sort -->', sort );
    console.log(' condition -->', condition);
    console.log(' filter -->', filter);
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
    return ads;
}


module.exports = {
    makePagination
}