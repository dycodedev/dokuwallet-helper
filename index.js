
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
                // includeWords: false,
                // includeExtras: false,
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

        register(userData, token, done) {
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

            const cfg = {
                token,
                body: userData,
                wordsSource: [
                    config.clientId,
                    config.sharedKey,
                    config.customerEmail,
                    systrace,
                ],
                secret: config.clientSecret,
            };

            cfg.body.clientId = config.clientId;

            return request.hitApi(cfg, done);
        },
    };
};
