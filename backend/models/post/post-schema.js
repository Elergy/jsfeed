let {Schema} = require('mongoose');

module.exports = new Schema({
    url: String,
    title: String,
    description: String,
    postDate: Date,
    grabDate: Date,
    published: {type: Boolean, default: false},
    blacklisted: {type: Boolean, default: false},
    tags: {type: [String], default: []},
    tweets: [{type: Number, ref: 'Tweet'}]
});