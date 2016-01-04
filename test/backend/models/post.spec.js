let {expect} = require('chai');
import initConnection from '../common/init-connection';

xdescribe('create post', () => {
    initConnection();

    it('post without tweet shound not be created', (done) => {

    });

    it('post with unique url should be created', (done) => {
        const url = 'http://elergy.ru/unique-path';
    });

    it('post with url we already have in collection should have a new Tweet', (done) => {

    });

    it('post should have tags to be published', (done) => {

    });
});