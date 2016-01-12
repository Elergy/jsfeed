let PostModel = require('./../post-model');

/**
 * Get count of unpublished posts
 * @returns {Promise}
 */
function getCount() {
    return PostModel.find({published: false, blacklisted: false}).count();
}

module.exports = getCount;