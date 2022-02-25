const { Schema, model } = require('mongoose');

const schemaCategory = new Schema({
    name: String
});

module.exports = model('Category', schemaCategory);