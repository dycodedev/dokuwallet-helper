'use strict';

const util = require('../lib/util');
const assert = require('assert');

describe('lib/util.js', () => {
    describe('makeWords(arrOfString, secret)', () => {
        it('Should return empty string when arrOfString is not an array', () => {
            const args = [1, 'asd', NaN, undefined, null, {}];
            const secret = 'someSecret';
            let result;

            args.forEach(arg => {
                result = util.makeWords(arg, secret);

                assert(result.length < 1);
                assert(typeof result === 'string');
            });
        });
    });

    describe('util(len)', () => {
        it('Should return empty string when len is not a number', () => {
            const args = ['1', 'a', {}, [], NaN, undefined, null];
            let result;

            args.forEach(arg => {
                result = util.uid(arg);

                assert(result.length < 1);
                assert(typeof result === 'string');
            });
        });
    });

    describe('generateSystrace()', () => {
        it('Should return string with length 30 character', () => {
            assert(util.generateSystrace().length === 30);
        });
    });
});
