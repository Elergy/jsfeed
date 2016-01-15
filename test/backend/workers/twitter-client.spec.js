let {expect} = require('chai');

let {getTwitterFeed} = require('./../../../backend/workers/twitter-client');

describe('get twitter feed', () => {
    it('should return 10 tweets', async () => {
        let tweets = await getTwitterFeed(null, 10);

        expect(tweets.length).to.equals(10);
    });
});