'use strict';

const validation = require('./validation');
const request = require('./request');

module.exports = function userApiFactory(config) {
    return {
        inquiry(payload, done) {
            const requiredFields = [
                {
                    name: 'clientId',
                    validationType: 'required',
                    message: 'clientId is required',
                },
                {
                    name: 'accessToken',
                    validationType: 'required',
                    message: 'accessToken is required',
                },
                {
                    name: 'accountId',
                    validationtype: 'required',
                    message: 'accountId is required',
                },
                {
                    name: 'systrace',
                    validationType: 'required',
                    message: 'systrace is required',
                },
            ];

            const validationResult = validation.validate(payload, requiredFields);

            if (!validationResult.valid) {
                return done(validationResult.reason);
            }

            const cfg = {
                body: _.omit(payload, ['systrace']),
                wordsSource: [
                    config.clientId,
                    payload.systrace,
                    config.sharedKey,
                    payload.accountId,
                ],
                secret: config.clientSecret,
                url: config.baseUrl + '/custinquiry',
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

        register(userData, done) {
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
                {
                    name: 'systrace',
                    validationType: 'required',
                    message: 'systrace is required',
                },
            ];

            const validationResult = validation.validate(userData, requiredFields);

            if (!validationResult.valid) {
                return done(validationResult.reason);
            }

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

            const cfg = {
                body: filteredBody,
                wordsSource: [
                    config.clientId,
                    config.sharedKey,
                    config.customerEmail,
                    userData.systrace,
                ],
                secret: config.clientSecret,
                url: config.baseUrl + '/signup',
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
    };
}