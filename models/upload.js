const { model, Schema } = require('mongoose');


const schemaUpload = new Schema({
    content: String,
    post_date: Date,
    name: String,
    type: String
},{
    timestamps: true
});

module.exports = model('Upload', schemaUpload);