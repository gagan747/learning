const newrelic = require('newrelic');

const config = require('../../config');
const log = require('../../log');
const request = require('../../request');

const fetchTrendingSGMBets = async (urlParams) => {
  try {
    const response = await request.get(config.get().trendingBetsService.url, urlParams);

    if (response && response.length) {
      return response;
    }
  } catch (e) {
    log.error(e, 'failed to fetch trending services');
    newrelic.noticeError(e);
  }

  return [];
};

module.exports = {
  fetchTrendingSGMBets,
};
