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
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    visible: Boolean,
    state: {
        type: Boolean,
        default: true
    },
    positive_points: {
        type: Number,
        default: 0
    },
    negative_points: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    edited: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

module.exports = model('Ad', schemaAd);