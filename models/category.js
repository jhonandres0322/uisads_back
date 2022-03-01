const { Schema, model } = require('mongoose');

const schemaCategory = new Schema({
    name: String
},{
    timestamps: true
});

module.exports = model('Category', schemaCategory);