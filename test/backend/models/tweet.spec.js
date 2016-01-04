let {expect} = require('chai');
import initConnection from '../common/init-connection';

import {
    create as createTweet,
    remove as removeTweets,
    updateCounts
} from './../../../backend/models/tweet';
import TweetModel from './../../../backend/models/tweet/model';

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
            expect(() => createTweet(123)).to.throw('createDate is not a string');
        });

        it('create call with unknown createDate should throw an error', () => {
            expect(() => createTweet(123, 'test', 'Unknown date')).to.throw('createDate has unknown format');
        });

        it('create call with too high createDate should throw an error', () => {
            expect(() => {
                createTweet(123, 'test', new Date(2125, 6, 6).toString());
            }).to.throw('createDate is too high');
        });

        it('create call with too low createDate should throw an error', () => {
            expect(() => {
                createTweet(123, 'test', new Date(1992, 6, 6).toString());
            }).to.throw('createDate is too long ago');
        });

        it('create call with unknown likesCount should throw an error', () => {
            expect(() => {
                createTweet(123, 'test', 'Wed Jun 06 20:07:10 +0000 2012', 'TEST');
            }).to.throw('likesCount is not a number');
        });

        it('create call with unknown retweetCount should throw an error', () => {
            expect(() => {
                createTweet(123, 'test', 'Wed Jun 06 20:07:10 +0000 2012', 6, 'TEST');
            }).to.throw('retweetCount is not a number');
        });
    });

    describe('create', () => {
        it('tweet should be created', (done) => {
            let promise = createTweet(123, 'test', 'Wed Jun 06 20:07:10 +0000 2012');

            promise.then((tweet) => {
                try {
                    tweet = tweet.toJSON();
                    delete tweet.__v;

                    expect(tweet).to.deep.equal({
                        _id: 123,
                        text: 'test',
                        createDate: new Date('Wed Jun 06 20:07:10 +0000 2012'),
                        likesCount: 0,
                        retweetCount: 0
                    });
                } catch (err) {
                    done(err);
                    return;
                }

                done();
            }, (err) => done(err));
        });

        it('tweet with existed id should not be created', (done) => {
            let promise = createTweet(123, 'test', 'Wed Jun 06 20:07:10 +0000 2012');

            promise.then((tweet) => {
                done('tweet was created');
            }, (err) => {
                try {
                    expect(err.name).to.be.equal('MongoError');
                } catch (ex) {
                    done(ex);
                    return;
                }

                done();
            });
        });

        it('tweet with defined likesCount and retweetCount should be created', (done) => {
            let promise = createTweet(1234, 'test', 'Wed Jun 06 20:07:10 +0000 2012', 6, 18);

            promise.then((tweet) => {
                try {
                    tweet = tweet.toJSON();
                    delete tweet.__v;

                    expect(tweet).to.deep.equal({
                        _id: 1234,
                        text: 'test',
                        createDate: new Date('Wed Jun 06 20:07:10 +0000 2012'),
                        likesCount: 6,
                        retweetCount: 18
                    });
                } catch (err) {
                    done(err);
                    return;
                }

                done();
            }, (err) => done(err));
        });
    });

    describe('remove', () => {
        it('should remove one tweet', (done) => {
            let oneTweetPromise = createTweet(9990, 'to-remove-one', 'Wed Jun 06 20:07:10 +0000 2012');
            oneTweetPromise.then(() => {
                removeTweets(9990).then(() => {
                    TweetModel
                        .count({text: 'to-remove-one'})
                        .then((count) => {
                            try {
                                expect(count).to.equal(0);
                            } catch (ex) {
                                done(ex);
                                return;
                            }

                            done();
                        }, (err) => done(err));
                }, (err) => done(err));
            }, (err) => done(err));
        });

        it('should remove one tweet when two were created', (done) => {
            let firstTweetPromise = createTweet(8880, 'to-remove-one-two', 'Wed Jun 06 20:07:10 +0000 2012');
            let secondTweetPromise = createTweet(8881, 'to-remove-one-two', 'Wed Jun 06 20:07:10 +0000 2012');
            Promise.all([firstTweetPromise, secondTweetPromise]).then(() => {
                removeTweets(8880).then(() => {
                    TweetModel
                        .count({text: 'to-remove-one-two'})
                        .then((count) => {
                            try {
                                expect(count).to.equal(1);
                            } catch (ex) {
                                done(ex);
                                return;
                            }

                            done();
                        }, (err) => done(err));
                }, (err) => done(err));
            }, (err) => done(err));
        });

        it('should remove two tweets when three were created', (done) => {
            let firstTweetPromise = createTweet(7770, 'to-remove-two-three', 'Wed Jun 06 20:07:10 +0000 2012');
            let secondTweetPromise = createTweet(7771, 'to-remove-two-three', 'Wed Jun 06 20:07:10 +0000 2012');
            let thirdTweetPromise = createTweet(7772, 'to-remove-two-three', 'Wed Jun 06 20:07:10 +0000 2012');
            Promise.all([firstTweetPromise, secondTweetPromise, thirdTweetPromise]).then(() => {
                removeTweets(7771, 7772).then(() => {
                    TweetModel
                        .count({text: 'to-remove-two-three'})
                        .then((count) => {
                            try {
                                expect(count).to.equal(1);
                            } catch (ex) {
                                done(ex);
                                return;
                            }

                            done();
                        }, (err) => done(err));
                }, (err) => done(err));
            }, (err) => done(err));
        });
    });

    describe('update', () => {
        it('should update counts', (done) => {
            let tweetPromise = createTweet(6660, 'to-update-counts', 'Wed Jun 06 20:07:10 +0000 2012', 4, 8);

            tweetPromise.then((tweet) => {
                try {
                    expect(tweet.likesCount).to.equal(4);
                    expect(tweet.retweetCount).to.equal(8);
                } catch (ex) {
                    done(ex);
                }
            }).then(() => {
                return updateCounts(6660, 222, 1);
            }).then(() => {
                return TweetModel.findById(6660);
            }).then((tweet) => {
                try {
                    tweet = tweet.toJSON();
                    delete tweet.__v;

                    expect(tweet).to.deep.equal({
                        _id: 6660,
                        text: 'to-update-counts',
                        createDate: new Date('Wed Jun 06 20:07:10 +0000 2012'),
                        likesCount: 222,
                        retweetCount: 1
                    });
                } catch (ex) {
                    done(ex);
                    return;
                }

                done();
            });
        });
    });
});