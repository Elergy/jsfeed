'use strict';

require('babel-register', {
    retainLines: true,
    plugins: [
        'syntax-async-functions'
    ]
});

let express = require('express');
let http = require('http');

let app = express();
app.set('port', 8080);

let server = http.createServer(app).listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});