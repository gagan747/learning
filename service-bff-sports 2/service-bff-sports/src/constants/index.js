const contentHubKeys = require('./content-hub-keys');
const discoveryKeys = require('./discovery-keys');
const infoKeys = require('./info-keys');
const recommendationKeys = require('./recommendation-keys');
const statsKeys = require('./stats-service-keys');
const templateKeys = require('./template-keys');

module.exports = {
  ...infoKeys,
  ...recommendationKeys,
  ...contentHubKeys,
  ...templateKeys,
  ...discoveryKeys,
  ...statsKeys,
};
