const mongoose = require('mongoose'),

Schema = mongoose.Schema;
const postSchema = new Schema({
    username: String,
    contactNumber: String,
    numberOfTotalRooms: Number,
    numberOfBedrooms: Number,
    kitchen: Boolean,
    attachedToiletBathroom: Boolean,
    floorArea: Number,
    floorNumber: Number,
    water: String,
    monthlyRent: Number,
    electricityChargeIncluded: Boolean,
    location: String,
    city: String,
    pincode:Number,
    description: String,
    imgs: [{
        data: Buffer,
        contentType: String
    }]
});
module.exports.postSchema= postSchema;


const userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    mobileno: String,
    email: String,
    password: String
});
module.exports.userSchema= userSchema;