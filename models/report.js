const { Schema, model } = require('mongoose');


const schemaReport = new Schema({
    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    description: String
});

module.exports = model('Report', schemaReport);