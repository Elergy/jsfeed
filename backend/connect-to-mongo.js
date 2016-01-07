let mongoose = require('mongoose');

/**
 * connect to mongo using process.env.mongo_address
 * @returns {Promise}
 */
function connectToMongo() {
    return new Promise((resolve, reject) => {
        let connection = mongoose.connection;
        connection.on('error', (err) => {
            reject(err);
        });
        connection.once('open', () => {
            resolve();
        });

        mongoose.connect(process.env.mongo_address);
    });
}

module.exports = connectToMongo;

