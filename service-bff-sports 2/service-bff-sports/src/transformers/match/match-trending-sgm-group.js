const config = require('../../config');
const launchDarkly = require('../../launch-darkly');
const utils = require('../../utils');
const { propositionMapper } = require('../proposition');

const getLegsData = ({ markets, contestants }, trendingBet) => {
  // get details of proposition that exists in trendingBet
  const toPropositionData = propositionMapper(contestants);

  return trendingBet.propositions.map((propId) => {
    const filteredMarket = markets.find((market) => market.propositions
      .some((p) => p.number === propId));
    return {
      betOption: filteredMarket.betOption,
      betOptionPriority: filteredMarket.betOptionPriority,
      proposition: toPropositionData(filteredMarket.propositions.find((p) => p.number === propId)),
    };
  }).sort((a, b) => a.betOptionPriority - b.betOptionPriority);
};

const getTrendingSgm = (match, trendingBet) => {
  const legsData = getLegsData(match, trendingBet);
  return {
    title: `${trendingBet.propositions.length} Leg Same Game Multi`,
    subtitle: `${trendingBet.numPunters} punters`,
    odds: trendingBet.odds,
    legs: legsData,
    sortOrder: trendingBet.sortOrder,
  };
};

const isNotAVulnerableSgmCombination = (trendingBet) => {
  const { sgmVulnerableBetGroups } = config.getDynamicConfig();
  if (Array.isArray(sgmVulnerableBetGroups) && sgmVulnerableBetGroups.length === 0) {
    return true;
  }

  const propositionNames = trendingBet.legs.map((leg) => leg.proposition.name);
  if (utils.unique(propositionNames).length === 1) {
    return !sgmVulnerableBetGroups.some((betOption) => {
      const betOptionMatcher = new RegExp(betOption, 'i');
      return trendingBet.legs.every((leg) => betOptionMatcher.test(leg.betOption));
    });
  }
  return true;
};

const getTrendingSgmData = (match, trendingBets) => {
  if (!trendingBets || !trendingBets.length) {
    return [];
  }
  const availablePropIds = match.markets
    .flatMap((m) => m.propositions)
    .map((p) => p.number);

  const trendingSgmData = trendingBets
    .filter((tb) => tb.propositions.every((p) => availablePropIds.includes(p)))
    .map((trendingBet) => getTrendingSgm(match, trendingBet))
    .filter(isNotAVulnerableSgmCombination);
  return utils.orderItems(trendingSgmData, 'asc', '');
};

const getTrendingSgmGroup = (match, trendingBets, params) => {
  if (!trendingBets || !trendingBets.length) {
    return undefined;
  }

  const isPsgmTweakEnabled = launchDarkly
    .isPsgmTweakEnabled(params.jurisdiction.toUpperCase());

  const sortedTrendingBets = utils
    .orderItems(trendingBets, 'desc', 'numPunters')
    .map((trendingSgm, index) => ({ ...trendingSgm, sortOrder: index + 1 }));

  const trendingSgmData = getTrendingSgmData(match, sortedTrendingBets);
  if (trendingSgmData.length <= 0) {
    return undefined;
  }

  return {
    title: 'Popular Same Game Multi',
    data: [
      {
        betOption: `Popular Same Game Multi ${trendingSgmData.length}`,
        type: 'sports.trending.samegamemulti',
        data: trendingSgmData,
        enabledPsgmTweak: isPsgmTweakEnabled,
      },
    ],
  };
};

module.exports = {
  getTrendingSgmGroup,
};
