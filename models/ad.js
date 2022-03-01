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
    post_date: {
        type: Date,
        default: new Date()
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    state: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }
},{
    timestamps: true
});

module.exports = model('Ad', schemaAd);