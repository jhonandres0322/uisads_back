const { Schema, model } = require('mongoose');

const schemaVote = new Schema({
    voter: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    ad: {
        type: Schema.Types.ObjectId,
        ref: 'Ad'
    },
    type: String
},{
    timestamps: true
});

module.exports = model('Vote', schemaVote);