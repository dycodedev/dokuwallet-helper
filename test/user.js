'use strict';

const assert = require('assert');
const _ = require('lodash');
const config = require('../credentials.json');
const userFactory = require('../lib/user');

describe('./lib/user.js', function() {
    this.timeout(30000);

    describe('.register(userData, systrace, done)', () => {
        const user = userFactory(config);

        it('Should throw error if systrace is falsy', done => {
            user.register({ systrace: '' }, (err, result) => {
                assert.ifError(result);
                assert(err);

                return done();
            });
        });

        it('Should throw error if required fields are not provided', done => {
            user.register({ systrace: 'some systrace' }, (err, result) => {
                assert.ifError(result);
                assert(err);

                return done();
            });
        });
    });
});