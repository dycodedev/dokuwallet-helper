'use strict';

const request = require('superagent');
const _ = require('lodash');
const util = require('./util');
const validate = require('./validation');

function doPostRequest(url, body, auth, done) {
    if (_.isEmpty(url)) {
        return done(new Error('URL should not be empty'));
    }

    if (auth && !_.isString(auth)) {
        return done(new Error('Authentication credential must be a base64 string'));
    }

    let reqObject = request.post(url);

    if (auth) {
        reqObject = reqObject.set('Authorization', `Basic ${auth}`);
    }

    return reqObject.send(body).end(done);
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

    const body = config.body;
    body.words = util.makeWords(config.wordsSource, config.secret);
    body.version = body.version || '1.0';
    body.responseType = body.responseType || 1;

    if (body.words.length < 1) {
        return done(new Error('wordsSource must be a valid array of string'));
    }

    return doPostRequest(config.url, body, config.auth, (err, response) => {
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
