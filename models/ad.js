const { model, Schema } = require('mongoose');


const schemaAd = new Schema({
    title: String,
    description: String,
    publisher: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Upload'
    }],
    post_date: Date,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    state: Boolean,
    rating: {
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }
});

module.exports = model('Ad', schemaAd);