const { Schema, model } = require('mongoose');

const schemaCategory = new Schema({
    name: String,
    key: String,
},{
    timestamps: true
});

module.exports = model('Category', schemaCategory);