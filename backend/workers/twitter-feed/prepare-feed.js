let assert = require('assert');
let unshortener = require('unshortener');
let urlParser = require('url');
let newrelic = require('newrelic');

let removeUrlParams = require('./../../common/remove-url-params');

const urlBlacklist = require('./url-blacklist');

/**
 * return true if url doesn't match to some of blacklisted patterns
 * @param {String} url
 * @returns {boolean}
 */
function filterBlacklistUrl(url) {
    return !urlBlacklist.some((blacklistedRe) => blacklistedRe.test(url));
}

/**
 * unshort url
 * @param {String} url
 * @returns {Promise}
 */
function unshortUrl(url) {
    return new Promise((resolve, reject) => {
        unshortener.expand(url, (err, resolvedUrl) => {
            if (err) {
                console.log(err);
                newrelic.noticeError(err);
                resolve(null);
                return;
            }

            resolve(urlParser.format(resolvedUrl));
        });
    });
}

/**
 * unshort all urls from array
 * @param {String[]} urls
 * @returns {Promise}
 */
function unshortUrls(urls) {
    return Promise.all(urls.map((url) => unshortUrl(url)));
}

/**
 * unshort urls and remove tracking params
 * @param {String[]} urls
 * @returns {Promise}
 */
function prepareUrls(urls) {
    return unshortUrls(urls)
        .then((urls) => urls.map(removeUrlParams));
}

/**
 * filter tweetFeed and format it
 * @param {Object[]} feed
 * @returns {Promise}
 */
function prepareFeed(feed) {
    assert(Array.isArray(feed), 'feed is not an array');

    feed = feed
        .filter((tweet) => tweet.entities && tweet.entities.urls && tweet.entities.urls.length)
        .map((tweet) => {
            if (tweet.retweeted_status) {
                return tweet.retweeted_status;
            }
            return tweet;
        });

    let feedPromises = feed
        .map((tweet) => {
            let urls = tweet.entities.urls.map((urlObject) => urlObject.url);

            return prepareUrls(urls)
                .then((urls) => {
                    urls = urls.filter((url) => url);
                    urls = urls.map((url) => url.toLowerCase());
                    urls = urls.filter(filterBlacklistUrl);

                    if (urls.length) {
                        return {
                            id: tweet.id,
                            createDate: tweet.created_at,
                            text: tweet.text,
                            userName: tweet.user.name,
                            userLogin: '@' + tweet.user.screen_name,
                            retweetCount: tweet.retweet_count,
                            likesCount: tweet.favorite_count,
                            urls: urls
                        };
                    }
                });
        });

    return Promise.all(feedPromises).then((tweets) => tweets.filter((tweet) => tweet));
}

module.exports = prepareFeed;