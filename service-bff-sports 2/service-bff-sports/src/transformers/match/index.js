const match = require('./match');
const matchHeader = require('./match-header');
const matchMarkets = require('./match-markets');
const matchTabs = require('./match-tabs');
const matchMarketsStats = require('./nba-stats');

module.exports = {
  ...match,
  ...matchHeader,
  ...matchMarkets,
  ...matchMarketsStats,
  ...matchTabs,
};
