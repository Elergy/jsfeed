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
let path = require('path');
var cookieParser = require('cookie-parser');

let connectToMongo = require('./connect-to-mongo');
let PostModel = require('./models/post/post-model');
let twitterFeedWorker = require('./workers/twitter-feed');

connectToMongo().then(() => twitterFeedWorker.start(), (err) => newrelic.noticeError(err));

let app = express();
app.set('port', process.env.port || 8080);
app.use(cookieParser());

app.all('/jsfeed/*', (req, res, next) => {
    let userName = req.cookies.user_name;
    let userPass = req.cookies.user_pass;

    if (userName !== process.env.username || userPass !== process.env.pass) {
        res.writeHead(401, 'Access error', {'Content-Type': 'text/plain'});
        res.end('Invalid credentials');
    } else {
        next();
    }
});

function errorHandler(err, req, res, next) {
    newrelic.noticeError(err);
    res.json({
        error: err.message
    });
}

app.get('/jsfeed/all-posts', (req, res) => {
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

var ghost = require('ghost');
ghost({
    config: path.join(__dirname, '../ghost/config.js')
}).then((ghostServer) => {
    app.use(ghostServer.config.paths.subdir, ghostServer.rootApp);
    ghostServer.start(app);
});