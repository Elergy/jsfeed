let Twitter = require('twitter');

let twitterClient = new Twitter({
    consumer_key: process.env.twitter_api_key,
    consumer_secret: process.env.twitter_api_secret,
    access_token_key: process.env.twitter_access_token,
    access_token_secret: process.env.twitter_access_token_secret
});

const TIMELINE_URL = '/statuses/home_timeline';

/**
 * get twitter feed for main account
 * @param {Number} [sinceId]
 * @param {Number} [count=50]
 * @returns {Promise}
 */
function getFeed(sinceId, count=50) {
    let params = {
        count,
        include_entities: true
    };

    if (sinceId) {
        params.since_id = sinceId;
        console.log(params);
    }

    return new Promise((resolve, reject) => {
        twitterClient.get(TIMELINE_URL, params, (error, tweets) => {
            if (error) {
                if (Array.isArray(error)) {
                    error = error[0];
                }
                reject(error);
                return;
            }

            resolve(tweets);
        });
    });
}

module.exports = getFeed;