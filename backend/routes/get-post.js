let {getPost, getCount} = require('./../models/post');

/**
 * Get one post to publish or to blacklist
 * @param req
 * @param res
 */
async function getPostMiddleware(req, res) {
    let count = await getCount();
    let post;
    if (count) {
        post = await getPost();
    }
    res.render('get-post', {post, count});
}

module.exports = getPostMiddleware;