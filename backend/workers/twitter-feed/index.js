let newrelic = require('newrelic');

let {getTwitterFeed} = require('./../twitter-client');
let prepareFeed = require('./prepare-feed');
let saveFeed = require('./save-feed');
let {getMaxTweetId} = require('./../../../backend/models/tweet');

const loadInterval = 3 * 60 * 1000;
let loadIntervalId;

async function loadFeedAndSave() {
    let feed;

    try {
        let maxTweetId = await getMaxTweetId();
        feed = await getTwitterFeed(maxTweetId);
        feed = await prepareFeed(feed);
    } catch(ex) {
        newrelic.noticeError(ex);
        return;
    }

    if (feed && feed.length) {
        try {
            await saveFeed(feed);
        } catch(ex) {
            newrelic.noticeError(ex);
        }
    }
}

async function start(interval=loadInterval) {
    loadIntervalId = setInterval(loadFeedAndSave, interval);
    await loadFeedAndSave();
}

function stop() {
    clearInterval(loadIntervalId);
}

module.exports = {
    start,
    stop
};