let PostModel = require('./../post-model');

/**
 * get post with specified url
 * @param {String} url
 * @returns {Promise}
 */
function getPostByUrl(url) {
    return PostModel.findOne({url});
}

module.exports = getPostByUrl;