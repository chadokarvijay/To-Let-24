const mongoose = require('mongoose'),

Schema = mongoose.Schema;
const imageSchema = new Schema({
    username: String,
    city: String,
    description: String,
    imgs: [{
        data: Buffer,
        contentType: String
    }]
});
module.exports.imageSchema= imageSchema;


const userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    mobileno: String,
    email: String,
    password: String
});
module.exports.userSchema= userSchema;