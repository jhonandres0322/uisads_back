const { Schema, model } = require('mongoose');

const schemaProfile = new Schema({
    name: String,
    cellphone: String,
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City'
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: 'Upload'
    },
    state: Boolean,
    description: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

module.exports = model('Profile', schemaProfile);