let mongoose = require('mongoose');
let tweetSchema = require('./tweet-schema');

let TweetModel = mongoose.model('Tweet', tweetSchema);

module.exports = TweetModel;