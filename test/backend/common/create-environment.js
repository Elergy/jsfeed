let env = require('node-env-file');
env('./.env');
process.env.mongo_address = process.env.mongo_address.replace('jsfeed', 'test');