'use strict';

const validation = require('../lib/validation');
const assert = require('assert');

describe('./lib/validation.js', function () {
    describe('.genericValidator(object, fields)', function () {
        it('Should return fail result when `object` is not an object', function () {
            const invalidParams = [
                null,
                undefined,
                false,
                1,
                'a',
                [],
                NaN,
                Infinity,
            ];

            invalidParams.forEach(param => {
                const result = validation.genericValidator(null, []);
                assert.equal(result.valid, false);
            });
        });

        it('Should return fail result when `fields` is not an array', function () {
            const invalidParams = [
                null,
                undefined,
                false,
                1,
                'a',
                {},
                NaN,
                Infinity,
            ];

            invalidParams.forEach(param => {
                const result = validation.genericValidator({a: 1}, param);
                assert.equal(result.valid, false);
            });
        });

        it('Should return success result', function () {
            const fields = [
                {
                    name: 'a',
                    validationType: 'required',
                    message: 'a is required',
                },
                {
                    name: 'b',
                    validationType: 'type',
                    validType: 'string',
                    message: 'b must be a string',
                },
            ];
            const object = {
                a: true,
                b: 'winter',
            };

            const result = validation.genericValidator(object, fields);

            assert.equal(result.reason, null);
            assert.equal(result.valid, true);
        });

        it('Should return fail result', function () {
            const fields = [
                {
                    name: 'a',
                    validationType: 'required',
                    message: 'a is required',
                },
                {
                    name: 'b',
                    validationType: 'type',
                    validType: 'string',
                    message: 'b must be a string',
                },
            ];
            const object = {
                a: true,
                b: 1,
            };

            const result = validation.genericValidator(object, fields);

            assert.notEqual(result.reason, null);
            assert.equal(result.valid, false);
        });
    });

    describe('.validateConfig(config)', function () {
        it('Should return success result if all valid', function () {
            const config = {
                clientId: 'some client id',
                clientSecret: 'some client secret',
            };

            const result = validation.validateConfig(config);

            assert.equal(result.valid, true);
            assert.equal(result.reason, null);
        });

        it('Should return fail if all invalid', function () {
            const configs = [
                {
                    clientId: 'some client',
                },
                {
                    clientSecret: 'some secret',
                },
                {
                    clientId: 1,
                    clientSecret: false,
                },
                {
                    clientId: [],
                    clientSecret: {}
                },
            ];

            configs.forEach(config => {
                const result = validation.validateConfig(config);

                assert.equal(result.valid, false);
                assert.notEqual(result.reason, null);
            });
        });
    });
});
