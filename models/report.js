const { Schema, model }= require('mongoose');


const schemaReport = new Schema({
    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    description: {
        type: String
    },
    ad: {
        type: Schema.Types.Boolean,
        ref: 'Ad'
    }
},{
    timestamps: true
});

module.exports = model('Report', schemaReport);