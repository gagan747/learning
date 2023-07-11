const betOptionsTemplate = require('./betOptionsTemplate');
const competition = require('./competition');
const featured = require('./featured');
const match = require('./match');
const matches = require('./matches');
const nextToGoMatch = require('./next-to-go-match');
const offers = require('./offers');
const promotion = require('./promotion');
const proposition = require('./proposition');
const sports = require('./sports');

module.exports = {
  ...betOptionsTemplate,
  ...match,
  ...matches,
  ...nextToGoMatch,
  ...promotion,
  ...proposition,
  ...sports,
  ...offers,
  ...featured,
  ...competition,
};
