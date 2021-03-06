'use strict';

const _ = require('lodash');
const crypto = require('crypto');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uid(len) {
    if (!_.isNumber(len)) {
        return '';
    }

    const parsedLen = parseInt(len);
    const buf = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charlen = chars.length;

    for (let i = 0; i < parsedLen; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
}

module.exports = {
    uid,
    generateSystrace: () => uid(30),
    makeWords(arrOfString, secret) {
        // no need to go for validation lib.
        if (!_.isArray(arrOfString)) {
            return '';
        }

        return crypto
            .createHmac('sha1', secret || '')
            .update(arrOfString.join(''))
            .digest('hex');
    },
    handleError(response) {
        const msg = response.responseMessage
            ? response.responseMessage.en
            : response.responseMsg;
        const error = new Error(msg);

        return error;
    },
};
