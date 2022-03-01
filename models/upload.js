const { model, Schema } = require('mongoose');


const schemaUpload = new Schema({
    content: String,
    post_date: {
        type: Date,
        default: Date.now()
    },
    name: String,
    type: String
},{
    timestamps: true
});

module.exports = model('Upload', schemaUpload);