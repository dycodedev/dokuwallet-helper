'use strict';

const _ = require('lodash');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    makeWords(arrOfString) {
        // no need to go for validation lib.
        if (!_.isArray(arrOfString)) {
            return '';
        }

        return crypto
            .createHash('sha1')
            .update(arrOfString.join(''))
            .digest('hex');
    },

    uid(len) {
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
    },
};
