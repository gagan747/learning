const array = require('./array');
const date = require('./date');
const errorHandlers = require('./error-handlers');
const fun = require('./function');
const icon = require('./icon');
const object = require('./object');
const promotion = require('./promotion');
const stats = require('./stats');
const string = require('./string');
const vision = require('./vision');

module.exports = {
  ...array,
  ...date,
  ...errorHandlers,
  ...fun,
  ...icon,
  ...object,
  ...promotion,
  ...stats,
  ...string,
  ...vision,
};
