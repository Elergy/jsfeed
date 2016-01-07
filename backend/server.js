'use strict';
require('node-env-file')('./.env');
let newrelic = require('newrelic');

require('babel-register', {
    retainLines: true,
    plugins: ['syntax-async-functions', 'transform-async-to-generator', 'transform-regenerator']
});
require('babel-polyfill');

let express = require('express');
let http = require('http');

let connectToMongo = require('./connect-to-mongo');
let PostModel = require('./models/post/post-model');
let twitterFeedWorker = require('./workers/twitter-feed');

connectToMongo().then(() => twitterFeedWorker.start(), (err) => newrelic.noticeError(err));

let app = express();
app.set('port', 8080);

function errorHandler(err, req, res, next) {
    newrelic.noticeError(err);
    res.json({
        error: err.message
    });
}

app.get('/all-posts', (req, res) => {
    PostModel.find({})
        .then((allPosts) => {
            return PostModel.populate(allPosts, {path: 'tweets'});
        })
        .then((allPosts) => {
            return allPosts.map((post) => post.toJSON());
        })
        .then((allPosts) => {
            res.json(allPosts);
        });
}, errorHandler);

let server = http.createServer(app).listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});