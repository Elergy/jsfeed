let PostModel = require('./../post-model');

/**
 * Publish post
 * @param {ObjectId} id
 */
async function publish(id) {
    let post = await PostModel.findById(id);

    if (post) {
        post = Object.assign(post, {
            blacklisted: false,
            published: true
        });

        return post.save();
    } else {
        throw new Error('post is not found');
    }
}

module.exports = publish;