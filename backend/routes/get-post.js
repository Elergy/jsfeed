let {getPost} = require('./../models/post');

/**
 * Get one post to publish or to blacklist
 * @param req
 * @param res
 */
async function getPostMiddleware(req, res) {
    let post = await getPost();

    res.render('get-post', {post});
}

module.exports = getPostMiddleware;