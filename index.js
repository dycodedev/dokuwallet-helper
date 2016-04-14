
const validation = require('./lib/validation');

module.exports = function constructHelper(config) {
    const validationResult = validation.validateConfig(config);

    if (false === validationResult.valid) {
        throw validationResult.reason;
    }

    return {};
};
