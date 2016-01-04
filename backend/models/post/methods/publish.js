let assert = require('assert');

import PostModel from './../model';

/**
 * Publish post
 * @param {ObjectId} id
 * @param {String} title
 * @param {String} description
 * @param {String} postDateString
 * @param {String[]} tags
 */
export default async function publish(id, title, description, postDateString, tags) {
    assert(title, 'title is not defined');
    assert(description, 'description is not defined');
    assert(postDateString, 'postDate is not defined');
    let postDate = new Date(postDateString);
    assert(!isNaN(postDate.getTime()), 'postDate has unknown format');
    assert(Array.isArray(tags), 'tags is not array');
    assert(tags.length, 'tags is empty');

    let post = await PostModel.findById(id);

    if (post) {
        post = Object.assign(post, {
            title,
            description,
            postDate,
            tags,
            blacklisted: false,
            published: true
        });

        return post.save();
    } else {
        throw new Error('post is not found');
    }
}
