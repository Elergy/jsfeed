let PostModel = require('./../post-model');

/**
 * get first not published and not blacklisted post
 * @returns {Promise}
 */
async function getPost() {
    let post = await PostModel.findOne({
        blacklisted: false,
        published: false
    });

    return PostModel.populate(post, {path: 'tweets'});
}

module.exports = getPost;

