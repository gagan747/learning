const config = require('../config');
const { recommendationFeaturedSport } = require('../constants/recommendation-keys');
const requestCache = require('../request-cache');
const { matchMapper, formatFeaturedResponse } = require('../transformers');
const { fetchPromotions } = require('./promotions');

const getFeaturedSportData = async (urlParams) => {
  const featuredSport = await requestCache.fetchRecommendation(
    recommendationFeaturedSport,
    urlParams,
  );

  if (!featuredSport || !featuredSport.competitions || !featuredSport.competitions.length) {
    return [];
  }
  const promotions = await fetchPromotions(urlParams);
  const { displayBetTypes } = config.getDynamicConfig();
  const toMatchData = matchMapper({ displayBetTypes, promotions });

  return {
    displayName: featuredSport.displayName,
    data: formatFeaturedResponse(urlParams)(toMatchData)(featuredSport),
  };
};

module.exports = {
  getFeaturedSportData,
};
