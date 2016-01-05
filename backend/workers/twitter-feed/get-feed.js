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
 * @param {Number} [count=200]
 * @returns {Promise}
 */
function getFeed(sinceId, count=200) {
    let params = {
        count,
        include_entities: true
    };

    if (sinceId) {
        params.sinceId = sinceId;
    }

    return new Promise((resolve, reject) => {
        twitterClient.get(TIMELINE_URL, params, (error, tweets) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(tweets);
        });
    });
}

export default getFeed;

