const { Schema, model } = require('mongoose');

const schemaProfile = new Schema({
    name: String,
    cellphone: String,
    city: String,
    image: {
        type: Schema.Types.ObjectId,
        ref: 'Upload'
    },
    state: {
        type: Boolean,
        default: true
    },
    description: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }
},{
    timestamps: true
});

schemaProfile.methods.toJSON = function () {
    const { __v, user, _id, ...profile } = this.toObject();
    profile.uid = _id;
    return profile;
}

module.exports = model('Profile', schemaProfile);