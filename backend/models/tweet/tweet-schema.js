let {Schema} = require('mongoose');

module.exports = new Schema({
    _id: Number,
    text: String,
    userName: String,
    userLogin: String,
    retweetCount: {type: Number, default: 0},
    likesCount: {type: Number, default: 0},
    createDate: Date,
    updateDate: Date
});