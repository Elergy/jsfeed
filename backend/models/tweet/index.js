let assert = require('assert');

let TweetModel = require('./tweet-model');

const TOO_LONG_AGO_DATE = new Date(2005, 1, 1);

/**
 * create new Tweet and save it to DB
 * @param {Number} id
 * @param {String} text
 * @param {String} userName
 * @param {String} userLogin
 * @param {String} createDate ex. 'Wed Jun 06 20:07:10 +0000 2012'
 * @param {Number} [likesCount=0]
 * @param {Number} [retweetCount=0]
 * @returns {Promise}
 */
function create(id, text, userName, userLogin, createDate, likesCount=0, retweetCount=0) {
    assert.equal(typeof id, 'number', 'tweet.id is not a number');
    assert.equal(typeof text, 'string', 'tweet.text is not a string');
    assert.equal(typeof userName, 'string', 'tweet.userName is not a string');
    assert.equal(typeof userLogin, 'string', 'tweet.userLogin is not a string');
    assert.equal(typeof createDate, 'string', 'createDate is not a string');
    createDate = new Date(createDate);
    assert.equal(isNaN(createDate.getTime()), false, 'createDate has unknown format');
    assert(createDate < Date.now(), 'createDate is too high');
    assert(createDate > TOO_LONG_AGO_DATE, 'createDate is too long ago');
    assert.equal(typeof likesCount, 'number', 'likesCount is not a number');
    assert.equal(typeof retweetCount, 'number', 'retweetCount is not a number');

    let tweet = new TweetModel({
        _id: id,
        text,
        createDate,
        likesCount,
        retweetCount,
        userName,
        userLogin
    });

    return tweet.save();
}

/**
 * remove tweets with specified ids
 * @param ids
 * @returns {Promise}
 */
function remove(...ids) {
    return TweetModel.remove({
        _id: {
            $in: ids
        }
    });
}

/**
 * update likesCount and retweetCount for particular tweet
 * @param {Number} id tweet.id
 * @param {Number} [likesCount=0]
 * @param {Number} [retweetCount=0]
 * @returns {*}
 */
function updateCounts(id, likesCount=0, retweetCount=0) {
    assert.equal(typeof id, 'number', 'tweet.id is not a number');
    assert.equal(typeof likesCount, 'number', 'likesCount is not a number');
    assert.equal(typeof retweetCount, 'number', 'retweetCount is not a number');

    return TweetModel.findByIdAndUpdate(id, {
        $set: {
            likesCount,
            retweetCount
        }
    });
}

/**
 * get maximum tweet id
 * @returns {Promise<number>}
 */
function getMaxTweetId() {
    return TweetModel
        .find({}, {_id: 1})
        .sort({_id: -1})
        .limit(1)
        .then((items) => {
            if (items && items.length) {
                return items[0]._id;
            }
        });
}

/**
 * get one tweet with earliest updateDate
 * @returns {Object}
 */
async function getFirstUpdatedTweet() {
    let tweet = await TweetModel.findOneAndUpdate({}, {
        $set: {
            updateDate: new Date(Date.now())
        }
    }, {
        sort: {updateDate: 1}
    });
    if (tweet) {
        tweet = tweet.toJSON();
    }
    return tweet;
}

module.exports = {
    create,
    remove,
    updateCounts,
    getMaxTweetId,
    getFirstUpdatedTweet
};