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
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let connectToMongo = require('./connect-to-mongo');
let twitterFeedWorker = require('./workers/twitter-feed');
let routes = require('./routes');

connectToMongo().then(() => twitterFeedWorker.start(), (err) => newrelic.noticeError(err));

let app = express();
app.set('port', process.env.port || 8080);
app.use(cookieParser());
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser());

app.all('/jsfeed/*', (req, res, next) => {
    let userName = req.cookies.user_name;
    let userPass = req.cookies.user_pass;

    if (userName !== process.env.username || userPass !== process.env.pass) {
        res.redirect(301, '/');
    } else {
        next();
    }
});

app.get('/jsfeed/post', routes.getPost);
app.post('/jsfeed/publish', routes.publishPost, (req, res) => {
    res.redirect(301, '/jsfeed/post');
});
app.post('/jsfeed/blacklist', routes.blacklistPost, (req, res) => {
    res.redirect(301, '/jsfeed/post');
});

function errorHandler(err, req, res, next) {
    newrelic.noticeError(err);
    res.json({
        error: err.message
    });
}

var ghost = require('ghost');
ghost({
    config: path.join(__dirname, '../ghost/config.js')
}).then((ghostServer) => {
    app.use(ghostServer.config.paths.subdir, ghostServer.rootApp);
    ghostServer.start(app);
});