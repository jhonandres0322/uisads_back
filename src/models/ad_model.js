const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
},{
    timestamps: true
});

schemaAd.virtual('main_page').get( function() {
    return this.images[0];
});

schemaAd.virtual('score').get( function() {
    return this.positive_points - this.negative_points;
});

schemaAd.plugin(mongoosePaginate);

module.exports = model('Ad', schemaAd);