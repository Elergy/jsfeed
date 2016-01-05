let {expect} = require('chai');

import prepareFeed from './../../../../backend/workers/twitter-feed/prepare-feed';

describe('prepare twitter feed', () => {
    it('should return filtered and formatted feed', async () => {
        let feed = require('./mocks/feed.json');
        let expectedPreparedFeed = require('./mocks/prepared-feed.json');

        let preparedFeed = await prepareFeed(feed);
        expect(preparedFeed).to.deep.equal(expectedPreparedFeed);
    });
});