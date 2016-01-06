let {expect} = require('chai');

let getFeed = require('./../../../../backend/workers/twitter-feed/get-feed');

describe('get twitter feed', () => {
    it('should return 10 tweets', async () => {
        let tweets = await getFeed(null, 10);

        expect(tweets.length).to.equals(10);
    });
});