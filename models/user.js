const { model, Schema} = require('mongoose');
const crypto = require('crypto');

const schemaUser = new Schema({
    email: String,
    password: String,
    state: {
        type: Boolean,
        default: true
    },
    retry: {
        type: Number,
        default: 0
    },
    blocked: {
        type: Boolean,
        default: false
    },
    firstEntry: {
        type: Date,
        default: new Date()
    },
    lastEntry: Date,
    available: Boolean,
    otp: String
}, {
    timestamps: true
})

schemaUser.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}



module.exports = model('User', schemaUser);