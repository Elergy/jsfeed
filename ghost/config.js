let path = require('path');
require('./custom');

let config = {
    production: {
        url: 'http://jsfeed.elergy.ru',
        mail: {},
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ghost.db')
            },
            debug: false
        },

        server: {
            host: '127.0.0.1',
            port: process.env.port
        },

        paths: {
            contentPath: path.join(__dirname, '..', 'ghost', 'content')
        }

    }
};

module.exports = config;
