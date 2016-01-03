let {Schema} = require('mongoose');

export default new Schema({
    url: String,
    postDate: Date,
    grabDate: Date,
    posted: {type: Boolean, default: false},
    blacklisted: {type: Boolean, default: false},
    tags: {type: [String], default: []},
    tweets: [{type: String, ref: 'Tweet'}]
});