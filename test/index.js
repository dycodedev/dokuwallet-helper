'use strict';

const assert = require('assert');
const _ = require('lodash');
const config = require('../credentials.json');
const mainFactory = require('../');

describe('DokuWallet(config)', function() {
    this.timeout(30000);

    it('Should return object if config is valid', () => {
        assert(_.isObject(mainFactory(config)));
    });

    it('Should throw exception if config is invalid', () => {
        const config = {
            clientId: '12345',
        };

        assert.throws(() => {
            mainFactory(config);
        });
    });

    describe('.signOnPartner(done)', () => {
        const main = mainFactory(config);

        it('Should carry result on callback if everyting is ok', done => {
            main.signOnPartner((err, result) => {
                assert.ifError(err);
                assert(result);
                assert.equal(result.clientId, config.clientId);
                assert.equal(result.responseCode, '0000');
                assert(result.responseMessage);
                assert(result.accessToken);
                assert.equal(result.expiresIn, 7200);

                return done();
            });
        });
    });

    describe('.register(userData, systrace, done)', () => {
        const main = mainFactory(config);

        it('Should throw error if systrace is falsy', done => {
            main.register({}, '', (err, result) => {
                assert.ifError(result);
                assert(err);

                return done();
            });
        });

        it('Should throw error if required fields are not provided', done => {
            main.register({}, 'some systrace', (err, result) => {
                assert.ifError(result);
                assert(err);

                return done();
            });
        });
    });

    describe('.debitPurchase(payload, systrace, done)', () => {
        const main = mainFactory(config);

        it('Should throw error if systrace is falsy', done => {
            main.debitPurchase({}, '', (err, result) => {
                assert.ifError(result);
                assert(err);

                return done();
            });
        });

        it('Should throw error if required fields are not provided', done => {
            main.debitPurchase({}, 'some systrace', (err, result) => {
                assert.ifError(result);
                assert(err);

                return done();
            });
        });
    });
});
