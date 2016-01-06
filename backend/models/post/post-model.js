let mongoose = require('mongoose');
let postSchema = require('./post-schema');

module.exports = mongoose.model('Post', postSchema);
