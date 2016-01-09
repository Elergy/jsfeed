let {Schema} = require('mongoose');

module.exports = new Schema({
    url: String,
    published: {type: Boolean, default: false},
    blacklisted: {type: Boolean, default: false},
    tweets: [{type: Number, ref: 'Tweet'}]
});