const { Schema, model } = require('mongoose');

const schemaRating = new Schema({
    score: Number,
    positive_points: Number,
    negative_points: Number
});


module.exports = model('Rating',schemaRating);