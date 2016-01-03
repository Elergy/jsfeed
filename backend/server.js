'use strict';

require('babel-register', {
    retainLines: true,
    plugins: [
        'syntax-async-functions'
    ]
});

let express = require('express');