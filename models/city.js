const { Schema, model } = require('mongoose');


const schemaCity = new Schema({
    name: String
});

module.exports = model('City', schemaCity);