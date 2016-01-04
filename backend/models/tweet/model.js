let mongoose = require('mongoose');
import tweetSchema from './schema';

let TweetModel = mongoose.model('Tweet', tweetSchema);

export default TweetModel;