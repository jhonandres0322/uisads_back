const { model, Schema} = require('mongoose');


const schemaUser = new Schema({
    email: String,
    passwod: String,
    state: Boolean,
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
    available: Boolean
}, {
    timestamps: true
})

schemaUser.methods.toJSON = () => {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', schemaUser);