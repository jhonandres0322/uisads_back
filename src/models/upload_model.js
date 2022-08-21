const { model, Schema } = require('mongoose');


const schemaUpload = new Schema({
    content: String,
    name: String,
    type: String,
    index: String
},{
    timestamps: true
});

module.exports = model('Upload', schemaUpload);