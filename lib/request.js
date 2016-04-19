'use strict';

const request = require('superagent');
const _ = require('lodash');
const util = require('./util');
const validate = require('./validation');

function doPostRequest(url, body, done) {
    if (_.isEmpty(url)) {
        return done(new Error('URL should not be empty'));
    }

    return request
        .post(url)
        .type('form')
        .send(body)
        .end(done);
}
// {
//     url: 'http://someurl.com/',
//     wordsSource: [],
//     auth: 'Base64String',
//     body: {}
// }

function hitApi(config, done) {
    const validationResult = validate.validateRequestConfig(config);

    if (!validationResult.valid) {
        return done(new Error(validationResult.reason));
    }

    const body = config.body || {};
    config.includeWords = typeof config.includeWords === 'undefined' ? true : config.includeWords;
    config.includeExtras = typeof config.includeExtras === 'undefined' ? true : config.includeExtras;

    if (config.includeWords) {
        body.words = util.makeWords(config.wordsSource, config.secret);
    }

    if (config.includeExtras) {
        body.version = body.version || '1.0';
        body.responseType = body.responseType || 1;
    }

    if (config.includeWords && body.words.length < 1) {
        return done(new Error('wordsSource must be a valid array of string'));
    }

    return doPostRequest(config.url, body, (err, response) => {
        if (err) {
            return done(err);
        }

        const respBody = response.body;

        return done(null, respBody);
    });
}

module.exports = {
    doPostRequest,
    hitApi,
};
