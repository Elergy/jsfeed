let assert = require('assert');

import removeUrlParams from './../../../common/remove-url-params';
import getPostByUrl from './get-post-by-url';
import PostModel from './../model';

/**
 * Create new post if post with this url doesn't exist yet.
 * Otherwise push tweetId to post.tweets array
 * @param {String} url
 * @param {Number} tweetId
 * @returns {Promise}
 */
export default async function create(url, tweetId) {
    url = removeUrlParams(url);
    assert.equal(typeof tweetId, 'number', 'tweetId is not a number');
    assert.equal(typeof url, 'string', 'url is not a string');

    let post = await getPostByUrl(url);

    if (post) {
        if (post.tweets.indexOf(tweetId) === -1) {
            post.tweets.push(tweetId);
        }
    } else {
        post = new PostModel({
            url,
            tweets:[tweetId],
            grabDate: Date.now()
        });
    }

    return post.save();
}