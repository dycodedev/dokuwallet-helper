'use strict';

const _ = require('lodash');
const validatorMap = {
    array: _.isArray,
    object: _.isObject,
    null: _.isNull,
    undefined: ref => !ref,
    nan: _.isNaN,
    date: _.isDate,
    number: _.isNumber,
    string: _.isString,
    boolean: _.isBoolean,
}

function makeReturn(status, error) {
    const errorObj = (typeof error === 'string')
        ? new Error(error)
        : error;

    return {
        valid: status,
        reason: errorObj,
    };
}

function isObjectHasParam(object, field) {
    return _.has(object, field);
}

function isCorrectType(object, field) {
    const validator = validatorMap[field.validType];

    if (!validator) {
        return false;
    }

    return validator(object[field.name]);
}

// {
//     name: 'name',
//     validationType: 'required', 'type'
//     validType: 'array',
//     message: 'field name is required',
// }

function genericValidator(target, fields) {
    if (!_.isObject(target))
        return makeReturn(false, new TypeError('target is not an Object'));

    if (!Array.isArray(fields))
        return makeReturn(false, new TypeError('fields is not an array of object'));

    for (let i = 0; i < fields.length; i++) {
        const currentField = fields[i];
        let validationResult;

        if (currentField.validationType === 'required') {
            validationResult = isObjectHasParam(target, currentField.name);

            if (false === validationResult)
                return makeReturn(false, currentField.message);
        } else if (currentField.validationType === 'type') {
            validationResult = isCorrectType(target, currentField);

            if (false === validationResult)
                return makeReturn(false, currentField.message);
        } else {
            return makeReturn(false, new Error('Not a valid validation type'));
        }
    }

    return makeReturn(true, null);
}

module.exports ={
    genericValidator,

    validateConfig(config) {
        const validFields = [
            {
                name: 'clientId',
                validationType: 'required',
                message: 'clientId is required',
            },
            {
                name: 'clientSecret',
                validationType: 'required',
                message: 'clientSecret is required',
            },
            {
                name: 'clientId',
                validationType: 'type',
                validType: 'string',
                message: 'clientId must be a string',
            },
            {
                name: 'clientSecret',
                validationType: 'type',
                validType: 'string',
                message: 'clientSecret must be a string',
            },
            {
                name: 'sharedKey',
                validationType: 'required',
                message: 'sharedKey is required',
            },
            {
                name: 'sharedKey',
                validationType: 'type',
                validType: 'string',
                message: 'sharedKey must be a string',
            },
            {
                name: 'dpMallId',
                validationType: 'required',
                message: 'dpMallId is required',
            },
            {
                name: 'dpMallId',
                validationType: 'type',
                validType: 'number',
                message: 'dpMallId must be a number',
            },
            {
                name: 'baseUrl',
                validationType: 'required',
                message: 'baseUrl is required',
            },
            {
                name: 'baseUrl',
                validationType: 'type',
                validType: 'string',
                message: 'baseUrl must be a string',
            },
        ];

        return genericValidator(config, validFields);
    },
};
