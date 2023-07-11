global.SRC = `${__dirname}/../src`;
global.TEST = `${__dirname}`;

require(`${global.SRC}/env`);
require(`${global.SRC}/log`);
require(`${global.SRC}/config`);
require('should');

process.env.TZ = 'Australia/Brisbane';
