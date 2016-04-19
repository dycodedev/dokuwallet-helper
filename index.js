'use strict';
const _ = require('lodash');

const validation = require('./lib/validation');
const request = require('./lib/request');
const util = require('./lib/util');

module.exports = function constructHelper(config) {
    const validationResult = validation.validateConfig(config);

    if (false === validationResult.valid) {
        throw validationResult.reason;
    }

    return {
        signOnPartner(done) {
            const body = {
                clientId: parseInt(config.clientId),
                clientSecret: config.clientSecret,
                dpMallId: config.dpMallId,
                sharedKey: config.sharedKey,
                partnerName: config.partnerName,
                systrace: util.generateSystrace(),
            };

            const cfg = {
                body,
                wordsSource: [config.clientId, config.sharedKey, body.systrace],
                url: config.baseUrl + '/signon',
                secret: config.clientSecret,
            };

            return request.hitApi(cfg, (err, result) => {
                if (err) {
                    return done(err);
                }

                if (result.responseCode !== '0000') {
                    return done(new Error(result.responseMessage.en));
                }

                result.systrace = body.systrace;
                return done(null, result);
            });
        },

        register(userData, systrace, done) {
            if (!systrace) {
                return done(new Error('systrace is required'));
            }

            const requiredFields = [
                {
                    name: 'customerName',
                    validationType: 'required',
                    message: 'customerName is required',
                },
                {
                    name: 'customerEmail',
                    validationType: 'reqired',
                    message: 'customerEmail is required',
                },
                {
                    name: 'customerPhone',
                    validationType: 'required',
                    message: 'customerPhone is required',
                },
            ];

            const validationResult = validation.validate(userData, requiredFields);

            const correctFields = [
                'accessToken',
                'clientId',
                'customerName',
                'customerEmail',
                'customerPhone',
                'customerDob',
                'customerPob',
                'customerIdentityType',
                'customerIdentityNo',
                'customerAddress',
                'customerGender',
                'customerCountry',
                'customerJob',
                'customerCity',
                'customerZipCode',
                'customerEducation',
            ];

            const filteredBody = _.pick(userData, correctFields);

            if (!validationResult.valid) {
                return done(validationResult.reason);
            }

            const cfg = {
                body: filteredBody,
                wordsSource: [
                    config.clientId,
                    config.sharedKey,
                    config.customerEmail,
                    systrace,
                ],
                secret: config.clientSecret,
            };

            cfg.body.clientId = config.clientId;

            return request.hitApi(cfg, (err, result) => {
                if (err) {
                    return done(err);
                }

                if (result.responseCode !== '0000') {
                    return done(new Error(result.responseMessage.en));
                }

                return done(null, result);
            });
        },

        debitPurchase(payload, systrace, done) {
            if (!systrace) {
                return done(new Error('systrace is required'));
            }

            const requiredFields = [
                {
                    name: 'accessToken',
                    validationType: 'required',
                    message: 'customerName is required',
                },
                {
                    name: 'accountId',
                    validationType: 'required',
                    message: 'accountId is required',
                },
                {
                    name: 'amount',
                    validationType: 'required',
                    message: 'amount is required',
                },
                {
                    name: 'transactionId',
                    validationType: 'required',
                    message: 'transactionId is required',
                },
                {
                    name: 'basket',
                    validationType: 'required',
                    message: 'basket is required',
                },
            ];

            const validationResult = validation.validate(payload, requiredFields);

            if (!validationResult.valid) {
                return done(validationResult.reason);
            }

            const correctFields = [
                'clientId',
                'accessToken',
                'accountId',
                'dpMallId',
                'amount',
                'transactionId',
                'basket',
            ];

            const newPayload = _.pick(payload, correctFields);
            newPayload.clientId = newPayload.clientId || config.clientId;
            newPayload.dpMallId = newPayload.dpMallId || config.dpMallId;

            const cfg = {
                body: newPayload,
                wordsSource: [
                    config.clientId,
                    newPayload.amount,
                    systrace,
                    config.dpMallId,
                    config.sharedKey,
                    newPayload.transactionId,
                ],
                secret: config.clientSecret,
            };

            return request.hitApi(cfg, (err, result) => {
                if (err) {
                    return done(err);
                }

                if (result.responseCode !== '0000') {
                    return done(new Error(result.responseMessage.en));
                }

                return done(null, result);
            });
        },
    };
};
