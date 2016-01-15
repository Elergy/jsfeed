/**
 * get twitter feed for main account
 * @param {Number} [sinceId]
 * @param {Number} [count=50]
 * @returns {Promise}
 */
function getFeed(sinceId, count=50) {
    let params = {
        count,
        include_entities: true
    };

    if (sinceId) {
        params.since_id = sinceId;
    }

    return new Promise((resolve, reject) => {
        twitterClient.get(TIMELINE_URL, params, (error, tweets) => {
            if (error) {
                if (Array.isArray(error)) {
                    error = error[0];
                }
                reject(error);
                return;
            }

            resolve(tweets);
        });
    });
}

module.exports = getFeed;