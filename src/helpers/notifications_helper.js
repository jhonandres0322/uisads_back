const Ad = require('../models/ad_model');
const { createDateFilter } = require('../helpers/ad_helper');

const createNotifications = async ( interests = [] ) => {
    console.time("createNotifications");
    if( interest.length === 0 ) return [];
    const notifications = [];
    const valueTime = createDateFilter('3m');
    const ads = await Ad.find({
        createdAt: { $gte: valueTime }
    })
    .sort({ createdAt: -1 });
    console.log('ads -->', ads);
    if ( ads.length > 0 ) { 
        ads.forEach( ad => {
            interests.find( interest => {
                const pattern = RegExp(interest, 'i');
                if ( pattern.test(ad.title) || pattern.test(ad.description) ) {
                    if( notifications.length > 30 ) return;
                    notifications.push( ad._id );
                }
            });
        });
    }
    console.timeEnd("createNotifications");
    return notifications;
}

module.exports = {
    createNotifications
}





