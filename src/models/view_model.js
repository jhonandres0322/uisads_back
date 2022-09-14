const { Schema, model } = require('mongoose');

const schemaView = new Schema({
    visiter: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    ad: {
        type: Schema.Types.ObjectId,
        ref: 'Ad'
    },
    view_date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = model('View', schemaView);