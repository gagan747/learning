const config = require('../../config');
const launchDarkly = require('../../launch-darkly');
const {
  orderedGrouper, pipe, promotionFinder, unique, objectSplicer,
} = require('../../utils');
const { propositionMapper } = require('../proposition');
const { getTrendingSgmGroup } = require('./match-trending-sgm-group');
const { statsGetter } = require('./stats');

const minMarketsToGroup = 10;

const groupByBetOption = orderedGrouper('betOptionSpectrumId');

const hasSameGame = (p) => p.sameGame;

const promoAvailableGetter = (promotions, promotionFinderParams) => {
  const findPromotions = promotionFinder(promotions);

  return (marketName) => !!findPromotions({ ...promotionFinderParams, marketName });
};

const getMarketMapper = (isSameGameMulti) => {
  const filterSameGame = isSameGameMulti
    ? (propositions) => propositions.filter(hasSameGame)
    : (propositions) => propositions;

  return ({ promoAvailable, stats }) => (toPropositionData) => (market, _, { length }) => ({
    marketName: length > 1 ? market.shortName : undefined,
    message: market.informationMessage || market.message || null,
    cashOutEligibility: isSameGameMulti ? 'Disabled' : market.cashOutEligibility,
    promoAvailable,
    allowWin: market.allowWin,
    allowPlace: market.allowPlace,
    allowEachWay: market.allowEachWay,
    allowMulti: market.allowMulti,
    sameGameMultipleSelections: (isSameGameMulti || market.sameGame)
      ? market.sameGameMultipleSelections : undefined,
    propositions: filterSameGame(market.propositions).map(toPropositionData),
    stats: (stats && stats.forProposition) ? undefined : stats,
  });
};

const getBetOptionMarketsMapper = (isSameGameMulti) => {
  const marketMapper = getMarketMapper(isSameGameMulti);

  return ({
    contestants,
    getPromoAvailable,
    getStats,
    marketPropsMappingValue = {},
    showSameGameInfo,
  }) => (betOptionMarkets) => {
    const [{ betOption }] = betOptionMarkets;
    const isHeadToHeadOrResult = ['Head To Head', 'Result'].includes(betOption);

    const stats = getStats(betOption);
    const toMarketData = marketMapper(
      {
        promoAvailable: getPromoAvailable(betOption),
        stats,
      },
    )(
      propositionMapper(
        isHeadToHeadOrResult ? contestants : [],
        marketPropsMappingValue[betOption],
        showSameGameInfo,
        stats,
      ),
    );

    return {
      betOption,
      type: isHeadToHeadOrResult
        ? 'sports.propositions.horizontal'
        : 'sports.propositions.vertical',
      data: betOptionMarkets.map(toMarketData),
    };
  };
};

const betOptionGroupMapper = (toBetOptionData) => (betOptionMarketsMap) => {
  const toData = (key) => (betOptionMarketsMap.has(key)
    ? toBetOptionData(betOptionMarketsMap.get(key))
    : []);

  return ({ name, betOptions }) => ({
    title: name,
    data: unique(betOptions).flatMap(toData),
  });
};

const othersGroupGetter = (betOptionGroups) => {
  const groupedBetOptions = betOptionGroups.flatMap((g) => g.betOptions);

  return (toBetOptionData) => (betOptionMarketsMap) => ({
    title: 'Others',
    data: [...betOptionMarketsMap.keys()]
      .filter((key) => !groupedBetOptions.includes(key))
      .map((key) => toBetOptionData(betOptionMarketsMap.get(key))),
  });
};

const betOptionMarketsMapGetter = (isSameGameMulti) => {
  const filterSameGame = (markets) => (isSameGameMulti
    ? markets.filter((m) => m.sameGame && m.propositions.some(hasSameGame))
    : markets);

  return pipe(filterSameGame, groupByBetOption);
};

const matchMarketsGetter = (isSameGameMulti) => {
  const type = 'sports.match.markets';
  const getBetOptionMarketsMap = betOptionMarketsMapGetter(isSameGameMulti);
  const betOptionMarketsMapper = getBetOptionMarketsMapper(isSameGameMulti);

  return ({
    betOptionGroups,
    contestants,
    id,
    markets,
    spectrumUniqueId,
    startTime,
  }, {
    promotions,
    trendingSGMBets,
    statsMatchup,
    statsTable,
    statsIntegrated,
    sportName,
    competitionName,
    tournamentName,
    version,
    showSameGameInfo,
    jurisdiction,
  }) => {
    const betOptionMarketsMap = getBetOptionMarketsMap(markets);

    const trendingSgmGroup = trendingSGMBets
      ? getTrendingSgmGroup({ contestants, markets }, trendingSGMBets, { jurisdiction })
      : undefined;

    if (!betOptionMarketsMap.size && !trendingSgmGroup) {
      return { type, data: [] };
    }

    const { marketPropsMapping } = config.getDynamicConfig();
    const trendingSgmGroupIndex = launchDarkly.getTrendingSGMGroupDisplayIndex();

    const withTrendingSgmGroup = objectSplicer(trendingSgmGroupIndex)(trendingSgmGroup);

    const toBetOptionData = betOptionMarketsMapper({
      contestants,
      showSameGameInfo,
      marketPropsMappingValue: marketPropsMapping[(competitionName || '').toLowerCase()],
      getPromoAvailable: promoAvailableGetter(promotions, {
        sportName,
        competitionName,
        tournamentName,
        matchId: id,
        matchStartTime: startTime,
      }),
      getStats: statsGetter({
        sportName,
        competitionName,
        version,
      })({
        spectrumUniqueId,
        contestants,
      })({
        statsMatchup,
        statsTable,
        statsIntegrated,
      }),
    });

    if (!betOptionGroups || !betOptionGroups.length || markets.length < minMarketsToGroup) {
      return {
        type,
        data: withTrendingSgmGroup([
          {
            title: '',
            data: [...betOptionMarketsMap.values()].map(toBetOptionData),
          },
        ]),
      };
    }

    const groups = betOptionGroups.filter((g) => g.types.includes(isSameGameMulti ? 'SGM' : 'ALL'));
    const toBetOptionGroupData = betOptionGroupMapper(toBetOptionData)(betOptionMarketsMap);
    const othersGroup = othersGroupGetter(groups)(toBetOptionData)(betOptionMarketsMap);

    return {
      type,
      data: withTrendingSgmGroup(
        groups
          .map(toBetOptionGroupData)
          .concat(othersGroup)
          .filter((d) => d.data.length),
      ),
    };
  };
};

const getAllMarkets = matchMarketsGetter();

const getSgmMarkets = matchMarketsGetter(true);

module.exports = {
  getAllMarkets,
  getSgmMarkets,
};
