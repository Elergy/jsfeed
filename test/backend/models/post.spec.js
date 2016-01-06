let {expect} = require('chai');
let sinon = require('sinon');
let {Schema: {ObjectId}} = require('mongoose');
let initConnection = require('./../common/init-connection');

let {create: createPost, publish: publishPost} = require('./../../../backend/models/post');
let PostModel = require('./../../../backend/models/post/post-model');

describe('post', () => {
    initConnection();

    describe('create', () => {
        it('post without tweet shound not be created', async () => {
            let exception;
            try {
                let res = await createPost('http://test.com');
            } catch (ex) {
                exception = ex;
            }

            expect(exception.message).to.equal('tweetId is not a number');
        });

        it('post with wrong url shound not be created', async () => {
            let exception;
            try {
                let res = await createPost('it is url', 123);
            } catch (ex) {
                exception = ex;
            }

            expect(exception.message).to.equal('url is not a string');
        });

        it('post with unique url should be created', async () => {
            const url = 'http://elergy.ru/unique-path';
            const grabDate = new Date(2012, 6, 6);
            sinon.stub(Date, 'now').returns(grabDate.getTime());

            let post = await createPost(url, 123);
            post = post.toJSON();
            delete post._id;
            delete post.__v;

            expect(post).to.deep.equal({
                url,
                published: false,
                blacklisted: false,
                grabDate,
                tags: [],
                tweets: [123]
            });

            Date.now.restore();
        });

        it('post with url we already have in collection should have a new Tweet', async () => {
            const url = 'http://elergy.ru/unique-path';

            let post = await createPost(url, 12345);
            post = post.toJSON();
            delete post._id;
            delete post.__v;

            expect(post).to.deep.equal({
                url,
                published: false,
                blacklisted: false,
                grabDate: new Date(2012, 6, 6),
                tags: [],
                tweets: [123, 12345]
            });
        });
    });

    describe('publish', () => {
        it('should not publish post if it does not exist', async () => {
            let exception;
            try {
                await publishPost(
                    ObjectId(),
                    'title',
                    'description',
                    new Date(2012, 6, 6).toString(),
                    ['js', 'react']
                );
            } catch(ex) {
                exception = ex;
            }

            expect(exception.message).to.equal('post is not found');
        });

        it('should publish post', async () => {
            const url = 'http://elergy.ru/publish-test-url';
            const grabDate = new Date(2014, 8, 9);
            const postDate = new Date(2012, 6, 6);

            sinon.stub(Date, 'now').returns(grabDate.getTime());

            let post = await createPost(url, 7899);
            await publishPost(
                post._id,
                'publish title',
                'description',
                postDate.toString(),
                ['js', 'react']
            );

            let publishedPost = await PostModel.findOne({url});
            publishedPost = publishedPost.toJSON();
            delete publishedPost._id;
            delete publishedPost.__v;

            expect(publishedPost).to.deep.equal({
                url,
                title: 'publish title',
                description: 'description',
                postDate: postDate,
                grabDate: grabDate,
                published: true,
                blacklisted: false,
                tags: ['js', 'react'],
                tweets: [7899]
            });

            Date.now.restore();
        });
    });
});