const { Schema, model } = require('mongoose');

const schemaProfile = new Schema({
    name: String,
    cellphone: String,
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
    score: {
        type: Number,
        default: 0
    },
    city : {
        type: Schema.Types.ObjectId,
        ref: 'City'
    },
    interests : [String],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Ad'
    }],
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Ad'
    }],
    isNotify: {
        type: Boolean,
        default: false
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