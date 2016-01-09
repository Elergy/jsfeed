let assert = require('assert');
let {blacklist} = require('./../models/post');

/**
 * Mark post as blacklisted
 * @param req
 * @param res
 * @param next
 */
async function blacklistPostMiddleware(req, res, next) {
    assert(req.body.id, 'post id is not defined');
    await blacklist(req.body.id);

    next();
}

module.exports = blacklistPostMiddleware;