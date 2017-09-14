/* eslint-disable import/no-commonjs */
const { randomBytes } = require('crypto');

module.exports.random = () => randomBytes(18).toString('base64');
