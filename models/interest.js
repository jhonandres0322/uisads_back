const { Schema, model } = require('mongoose');


const schemaInterest = new Schema({
    name: String
},{
    timestamps: true
});


module.exports = model('Interest', schemaInterest);