let Twitter = require('twitter');

let twitterClient = new Twitter({
    consumer_key: process.env.twitter_api_key,
    consumer_secret: process.env.twitter_api_secret,
    access_token_key: process.env.twitter_access_token,
    access_token_secret: process.env.twitter_access_token_secret
});

const TIMELINE_URL = '/statuses/home_timeline';
const TWEET_INFO_URL = '/statuses/show/';

/**
 * twitter's error can not to be instance of Error. Should use first error
 * @param {Object, Array, String} error
 * @returns {Error, Object, String}
 */
function getTwitterError(error) {
    if (Array.isArray(error)) {
        error = error[0];
    }
    return error;
}

/**
 * get twitter feed for main account
 * @param {Number} [sinceId]
 * @param {Number} [count=50]
 * @returns {Promise}
 */
function getTwitterFeed(sinceId, count=50) {
    let params = {
        count,
        include_entities: true
    };

    if (sinceId) {
        params.since_id = sinceId;
    }

    return new Promise((resolve, reject) => {
        twitterClient.get(TIMELINE_URL, params, (error, tweets) => {
            if (error) {
                error = getTwitterError(error);

                reject(error);
                return;
            }

            resolve(tweets);
        });
    });
}

/**
 * get info about one tweet
 * @param {String, Number} tweetId
 * @returns {Promise}
 */
function getTweetInfo(tweetId) {
    let params = {id: tweetId};
    let url = TWEET_INFO_URL + tweetId;

    return new Promise((resolve, reject) => {
        twitterClient.get(TWEET_INFO_URL, params, (error, tweet) => {
            if (error) {
                error = getTwitterError(error);

                reject(error);
                return;
            }
            resolve(tweet);
        });
    });
}

module.exports = {
    getTwitterFeed,
    getTweetInfo
};