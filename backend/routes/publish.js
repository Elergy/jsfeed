let assert = require('assert');
let {publish} = require('./../models/post');

async function publishPostMiddleware(req, res, next) {
    assert(req.body.id, 'post id is not defined');

    await publish(req.body.id);

    next();
}

module.exports = publishPostMiddleware;