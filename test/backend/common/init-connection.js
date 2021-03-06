let mongoose = require('mongoose');
let {expect} = require('chai');

function initConnection() {
    let connection;

    before((done) => {
        connection = mongoose.connection;
        connection.on('error', (err) => {
            throw err;
        });
        connection.once('open', () => {
            console.log('test connection is open now');

            done();
        });

        mongoose.connect(process.env.mongo_address);
    });

    after((done) => {
        connection.db.dropDatabase();
        connection.once('close', () => {
            console.log('test connection is closed now');

            done();
        });

        connection.close();
    });

    describe('connection', () => {
        it('connection should have connected state', () => {
            expect(connection.readyState).to.equal(1);
        });
    });
}

module.exports = initConnection;