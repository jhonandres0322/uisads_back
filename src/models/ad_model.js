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
    main_page: {
        type: Schema.Types.ObjectId,
        ref: 'Upload'
    },
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


schemaAd.pre("save", function(next) {
    this.main_page = this.images[0];
    next();
});

schemaAd.plugin(mongoosePaginate);

module.exports = model('Ad', schemaAd);