const cache = require('./cache');
const config = require('./config');
const request = require('./request');

const {
  aem,
  infoService,
  recommendationService,
  contentHubService,
  statsService,
} = config.get();

const fetcher = (useDefault = true) => async (url, urlParams, timeToLive) => {
  const key = `${url}#${JSON.stringify(urlParams)}`;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await (useDefault ? request.getDefault : request.get)(url, urlParams);

  cache.set(key, response, timeToLive);

  return response;
};

const fetch = fetcher();

const serviceFetcher = ({ url, cacheDuration }) => async (discoveryKey, urlParams, timeToLive) => {
  const {
    _links: {
      [discoveryKey]: link,
    },
  } = await fetch(url, {}, cacheDuration);

  const { [discoveryKey]: ttl, defaultTtl } = config.getDynamicConfig().cacheDuration;

  return fetch(link, urlParams, timeToLive || ttl || defaultTtl);
};

const fetchAem = async (configKey, urlParams, timeToLive) => {
  const { baseUrl, [configKey]: { path, cacheDuration } } = aem;

  return fetch(baseUrl + path, urlParams, timeToLive || cacheDuration);
};

const fetchInfo = serviceFetcher(infoService);

const fetchRecommendation = serviceFetcher(recommendationService);

const fetchContentHub = serviceFetcher(contentHubService);

const fetchStats = serviceFetcher(statsService);

module.exports = {
  fetchAem,
  fetchInfo,
  fetchRecommendation,
  fetchContentHub,
  fetchStats,
};
