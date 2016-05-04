'use strict';
const _ = require('lodash');

const validation = require('./lib/validation');
const request = require('./lib/request');
const util = require('./lib/util');

// factories
const userFactory = require('./lib/user');

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
                    const error = new Error(result.responseMessage.en);
                    error.code = result.responseCode;

                    return done(err);
                }

                result.systrace = body.systrace;
                return done(null, result);
            });
        },

        debitPurchase(payload, done) {
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
                    name: 'systrace',
                    validationType: 'required',
                    message: 'systrace is required',
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
            newPayload.amount = parseInt(newPayload.amount);

            const cfg = {
                body: newPayload,
                wordsSource: [
                    config.clientId,
                    newPayload.amount,
                    payload.systrace,
                    config.dpMallId,
                    config.sharedKey,
                    newPayload.transactionId,
                ],
                secret: config.clientSecret,
                url: config.baseUrl + '/payment',
            };

            return request.hitApi(cfg, (err, result) => {
                if (err) {
                    return done(err);
                }

                if (result.responseCode !== '0000') {
                    const error = new Error(result.responseMessage.en);
                    error.code = result.responseCode;

                    return done(error);
                }

                return done(null, result);
            });
        },

        user: userFactory(config),
    };
};
