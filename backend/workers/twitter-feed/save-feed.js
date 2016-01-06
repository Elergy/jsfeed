let newrelic = require('newrelic');

let {create: createPost} = require('./../../models/post');
let {create: createTweet, remove: removeTweet} = require('./../../models/tweet');

/**
 * save tweets and posts from feed
 * @param {Object[]} feed
 */
async function saveFeed(feed=[]) {
    for (let {id, text, userName, userLogin, createDate, likesCount, retweetCount, urls} of feed) {
        let savedTweet;
        let savedPosts;

        try {
            savedTweet = await createTweet(id, text, userName, userLogin, createDate, likesCount, retweetCount);
        } catch(ex) {
            newrelic.noticeError(ex);
            continue;
        }

        if (savedTweet && savedTweet._id) {
            try {
                savedPosts = await Promise.all(urls.map((url) => createPost(url, savedTweet._id)));
            } catch(ex) {
                newrelic.noticeError(ex);

                await removeTweet(savedTweet._id);
            }
        }
    }
}

module.exports = saveFeed;