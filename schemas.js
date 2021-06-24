const mongoose = require('mongoose'),

Schema = mongoose.Schema;
const imageSchema = new Schema({
    userid: String,
    city: String,
    description: String,
    img: {
        data: Buffer,
        contentType: String
    }
});
module.exports.imageSchema= imageSchema;
