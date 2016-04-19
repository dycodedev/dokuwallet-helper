'use strict';

const request = require("../lib/request");
const assert = require('assert');

describe('lib/request.js', () => {
    describe('doPostRequest(url, body, done)', function() {
        this.timeout(30000);

        it('Should carry error on callback if url is not a valid url', done => {
            request.doPostRequest(null, {}, err => {
                assert.ok(err);
                assert(err.message.indexOf('URL') >= 0);

                return done();
            });
        });
    });

    describe('hitApi(config, done)', function() {
        this.timeout(30000);

        it('Should carry error on callback if config is invalid', done => {
            const config = {
                body: {},
            };

            request.hitApi(config, err => {
                assert.ok(err);

                return done();
            });
        });

        it('Should carry error on callback if words is empty', done => {
            const config = {
                body: {},
                url: 'http://httpbin.org/post',
                wordsSource: {},
                secret: 'someSecret',
            };

            request.hitApi(config, err => {
                assert.ok(err);
                assert.ok(err.message.indexOf('wordsSource') >= 0);

                return done();
            });
        });

        it('Should carry result on callback if config is valid', done => {
            const config = {
                body: {},
                url: 'http://httpbin.org/post',
                wordsSource: ['a'],
                secret: 'someSecret',
            };

            request.hitApi(config, (err, response) => {
                assert.ok(response);
                assert.ifError(err);

                return done();
            });
        });
    });
});