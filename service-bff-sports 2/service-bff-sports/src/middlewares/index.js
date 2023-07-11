const requestParamsMW = require('./request-params');
const responseHeadersMW = require('./response-headers');

module.exports = {
  ...requestParamsMW,
  ...responseHeadersMW,
};
