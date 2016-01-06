let {expect} = require('chai');
let sinon = require('sinon');
let newrelic = require('newrelic');

let initConnection = require('./../../common/init-connection');
let TweetModel = require('./../../../../backend/models/tweet/tweet-model');
let PostModel = require('./../../../../backend/models/post/post-model');
let post = require('./../../../../backend/models/post');
let saveFeed = require('./../../../../backend/workers/twitter-feed/save-feed');

describe('save feed', () => {
    initConnection();

    beforeEach(async () => {
        await TweetModel.remove({}).exec();
        await PostModel.remove({});
    });

    it('tables should be empty before saving', async () => {
        const tweetCount = await TweetModel.find({}).count();
        const postCount = await PostModel.find({}).count();

        expect(tweetCount).to.equal(0);
        expect(postCount).to.equal(0);
    });

    it('should add 6 tweets and 7 posts', async () => {
        let preparedFeed = require('./mocks/prepared-feed.json');
        let expectedTweetsInDB = require('./mocks/tweets-in-db.json').map((tweet) => {
            tweet.createDate = new Date(tweet.createDate);
            return tweet;
        });
        let expectedPostsInDB = require('./mocks/posts-in-db.json').map((post) => {
            return post;
        });

        await saveFeed(preparedFeed);

        let tweets = await TweetModel.find({}, {__v: 0});
        let posts = await PostModel.find({}, {_id: 0, __v: 0, grabDate: 0});

        tweets = tweets.map((tweet) => tweet.toJSON());
        posts = posts.map((post) => post.toJSON());

        expect(tweets).to.deep.equal(expectedTweetsInDB);
        expect(posts).to.deep.equal(expectedPostsInDB);
    });

    it('should throw 6 errors', async () => {
        let nrMock = sinon.mock(newrelic);
        let expectation = nrMock.expects('noticeError').exactly(6);
        let preparedFeed = require('./mocks/prepared-feed.json');

        await saveFeed(preparedFeed);
        await saveFeed(preparedFeed);

        expectation.verify();
        nrMock.restore();
    });
});