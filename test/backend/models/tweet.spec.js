let {expect} = require('chai');
let initConnection = require('../common/init-connection');
let sinon = require('sinon');

let {
    create: createTweet,
    remove: removeTweets,
    updateCounts,
    getMaxTweetId,
    getFirstUpdatedTweet
} = require('./../../../backend/models/tweet');
let TweetModel = require('./../../../backend/models/tweet/tweet-model');

describe('tweet', () => {
    initConnection();

    describe('validation', () => {
        it('create call without any id should throw an error', () => {
            expect(createTweet).to.throw('tweet.id is not a number');
        });

        it('create call with string id should throw an error', () => {
            expect(() => createTweet('string_id')).to.throw('tweet.id is not a number');
        });

        it('create call without date should throw an error', () => {
            expect(() => createTweet(123, 'text', 'Author', '@author')).to.throw('createDate is not a string');
        });

        it('create call with unknown createDate should throw an error', () => {
            expect(() => {
                createTweet(123, 'test', 'Author', '@author', 'Unknown date');
            }).to.throw('createDate has unknown format');
        });

        it('create call with too high createDate should throw an error', () => {
            expect(() => {
                createTweet(123, 'test', 'Author', '@author', new Date(2125, 6, 6).toString());
            }).to.throw('createDate is too high');
        });

        it('create call with too low createDate should throw an error', () => {
            expect(() => {
                createTweet(123, 'test', 'Author', '@author', new Date(1992, 6, 6).toString());
            }).to.throw('createDate is too long ago');
        });

        it('create call with unknown likesCount should throw an error', () => {
            expect(() => {
                createTweet(123, 'test', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012', 'TEST');
            }).to.throw('likesCount is not a number');
        });

        it('create call with unknown retweetCount should throw an error', () => {
            expect(() => {
                createTweet(123, 'test', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012', 6, 'TEST');
            }).to.throw('retweetCount is not a number');
        });
    });

    describe('create', () => {
        it('tweet should be created', async () => {
            let tweet = await createTweet(123, 'test', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012');

            tweet = tweet.toJSON();
            delete tweet.__v;

            expect(tweet).to.deep.equal({
                _id: 123,
                text: 'test',
                userName: 'Author',
                userLogin: '@author',
                createDate: new Date('Wed Jun 06 20:07:10 +0000 2012'),
                likesCount: 0,
                retweetCount: 0
            });
        });

        it('tweet with existed id should not be created', async () => {
            let exception;
            try {
                await createTweet(123, 'test', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012');
            } catch(ex) {
                exception = ex;
            }

            expect(exception.name).to.be.equal('MongoError');
        });

        it('tweet with defined likesCount and retweetCount should be created', async () => {
            let tweet = await createTweet(1234, 'test', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012', 6, 18);

            tweet = tweet.toJSON();
            delete tweet.__v;

            expect(tweet).to.deep.equal({
                _id: 1234,
                text: 'test',
                userName: 'Author',
                userLogin: '@author',
                createDate: new Date('Wed Jun 06 20:07:10 +0000 2012'),
                likesCount: 6,
                retweetCount: 18
            });
        });
    });

    describe('remove', () => {
        it('should remove one tweet', async () => {
            await createTweet(9990, 'to-remove-one', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012');
            await removeTweets(9990);

            let countTweetsToRemove = await TweetModel.count({text: 'to-remove-one'});
            expect(countTweetsToRemove).to.equal(0);
        });

        it('should remove one tweet when two were created', async () => {
            await createTweet(8880, 'to-remove-one-two', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012');
            await createTweet(8881, 'to-remove-one-two', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012');

            await removeTweets(8880);

            let countTweets = await TweetModel.count({text: 'to-remove-one-two'});
            expect(countTweets).to.equal(1);
        });

        it('should remove two tweets when three were created', async () => {
            await createTweet(7770, 'to-remove-two-three', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012');
            await createTweet(7771, 'to-remove-two-three', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012');
            await createTweet(7772, 'to-remove-two-three', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012');

            await removeTweets(7771, 7772);

            let count = await TweetModel.count({text: 'to-remove-two-three'});
            expect(count).to.equal(1);
        });
    });

    describe('update', () => {
        it('should update counts', async() => {
            let tweet = await createTweet(6660, 'to-update-counts', 'Author', '@author',
                'Wed Jun 06 20:07:10 +0000 2012', 4, 8);

            expect(tweet.likesCount).to.equal(4);
            expect(tweet.retweetCount).to.equal(8);

            await updateCounts(6660, 222, 1);

            tweet = await TweetModel.findById(6660);

            tweet = tweet.toJSON();
            delete tweet.__v;

            expect(tweet).to.deep.equal({
                _id: 6660,
                text: 'to-update-counts',
                userName: 'Author',
                userLogin: '@author',
                createDate: new Date('Wed Jun 06 20:07:10 +0000 2012'),
                likesCount: 222,
                retweetCount: 1
            });
        });
    });

    describe('get max tweet id', () => {
        it('should return maximum tweet id', async () => {
            await createTweet(99999, 'to-get-max', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012');
            await createTweet(899999, 'to-get-max', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012');
            await createTweet(799999, 'to-get-max', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012');

            let maxTweetId = await getMaxTweetId();
            expect(maxTweetId).to.equal(899999);
        });
    });

    describe('get first updated tweet', () => {
        beforeEach(async () => {
            await TweetModel.remove({});
        });

        afterEach(() => {
            Date.now.restore && Date.now.restore();
        });

        it('should return tweets with lower updateDate', async () => {
            const firstUpdateDate = new Date(2012, 2, 2);
            const secondUpdateDate = new Date(2012, 3, 3);
            const thirdUpdateDate = new Date(2012, 4, 4);
            const fourthUpdateDate = new Date(2012, 6, 6);
            const minUpdateDate = new Date(2011, 5, 5);

            let firstUpdatedTweet;
            let lastUpdatedTweets;

            await createTweet(1000, 'to-get-first-1', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012');
            await createTweet(2000, 'to-get-first-2', 'Author', '@author', 'Wed Jun 06 20:07:10 +0000 2012');

            let tweets = await TweetModel.find({}, {_id: 1, updateDate: 1});
            tweets = tweets.map((tweet) => tweet.toJSON());

            expect(tweets).to.deep.equal([
                {_id: 1000},
                {_id: 2000}
            ]);

            sinon.stub(Date, 'now').returns(firstUpdateDate.getTime());

            firstUpdatedTweet = await getFirstUpdatedTweet();
            expect(firstUpdatedTweet._id).to.equals(1000);
            lastUpdatedTweets = await TweetModel.find({}, {_id:1, updateDate: 1}).sort({updateDate: -1}).limit(1);
            expect(lastUpdatedTweets[0].toJSON()).to.deep.equals({_id: 1000, updateDate: firstUpdateDate});

            Date.now.restore();
            sinon.stub(Date, 'now').returns(secondUpdateDate.getTime());
            firstUpdatedTweet = await getFirstUpdatedTweet();
            expect(firstUpdatedTweet._id).to.equals(2000);
            lastUpdatedTweets = await TweetModel.find({}, {_id:1, updateDate: 1}).sort({updateDate: -1}).limit(1);
            expect(lastUpdatedTweets[0].toJSON()).to.deep.equals({_id: 2000, updateDate: secondUpdateDate});

            Date.now.restore();
            sinon.stub(Date, 'now').returns(thirdUpdateDate.getTime());
            firstUpdatedTweet = await getFirstUpdatedTweet();
            expect(firstUpdatedTweet._id).to.equals(1000);
            lastUpdatedTweets = await TweetModel.find({}, {_id:1, updateDate: 1}).sort({updateDate: -1}).limit(1);
            expect(lastUpdatedTweets[0].toJSON()).to.deep.equals({_id: 1000, updateDate: thirdUpdateDate});

            Date.now.restore();
            sinon.stub(Date, 'now').returns(fourthUpdateDate.getTime());
            await TweetModel.create({
                _id: 3000,
                updateDate: minUpdateDate
            });
            firstUpdatedTweet = await getFirstUpdatedTweet();
            expect(firstUpdatedTweet._id).to.equals(3000);
            lastUpdatedTweets = await TweetModel.find({}, {_id:1, updateDate: 1}).sort({updateDate: -1}).limit(1);
            expect(lastUpdatedTweets[0].toJSON()).to.deep.equals({_id: 3000, updateDate: fourthUpdateDate});
        });
    });
});