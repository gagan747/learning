const config = require('../../config');
const { screenMatch, bffTournamentMatch, bffCompetitionMatch } = require('../../constants');
const { generateSportIcon, fetchVisionFlags, promotionFinder } = require('../../utils');
const { getTemplate } = require('../betOptionsTemplate');
const { propositionMapper } = require('../proposition');

const fetchMarket = ({ displayBetTypes, markets }) => {
  if (displayBetTypes[0] === 'all') {
    return markets[0] || {};
  }
  let market = {};
  for (let i = 0; i < displayBetTypes.length; i++) {
    const mkt = markets.find((m) => (
      displayBetTypes[i] === ((m.betOption || '').toLowerCase())
    ));
    if (mkt) {
      market = mkt;
      break;
    }
  }
  return market;
};

const fetchPriorityMarkets = ({ displayBetTypes, markets }) => {
  if (displayBetTypes[0] === 'all') {
    return markets[0] || {};
  }
  const market = [];
  for (let i = 0; i < displayBetTypes.length; i++) {
    const mkt = markets.filter((m) => (
      displayBetTypes[i] === ((m.betOption || '').toLowerCase())
    ));
    if (mkt.length) {
      market.push(...mkt);
      break;
    }
  }
  return market;
};

const matchMapper = ({
  displayBetTypes = [],
  promotions = [],
} = {}) => ({
  sportName,
  competitionName,
  tournamentName,
}) => (match) => {
  if (!(match.markets && match.markets.length)) {
    return null;
  }

  const { hasPreview, hasVision } = fetchVisionFlags(match);
  const toPropositionData = propositionMapper(match.contestants, false, true);
  const market = fetchMarket({ displayBetTypes, markets: match.markets });
  const { betOption } = market;
  const marketCloseTime = market.closeTime || match.markets[0].closeTime;
  let propositions = [];

  if (market.propositions && market.propositions.length) {
    propositions = market.propositions.map(toPropositionData);
  }

  const promoAvailable = !!promotionFinder(promotions)({
    sportName,
    competitionName,
    tournamentName,
    matchId: match.id,
    matchStartTime: match.startTime,
  });

  return {
    type: getTemplate(betOption),
    title: match.name,
    subTitle: tournamentName || competitionName,
    matchId: match.id,
    betOption,
    inPlay: !!match.inPlay,
    goingInPlay: !!match.goingInPlay,
    startTime: match.startTime,
    displayTime: marketCloseTime || match.closeTime || match.startTime,
    hasVision: hasPreview || hasVision,
    sameGame: match.sameGame,
    cashOutEligibility: market.cashOutEligibility,
    promoAvailable,
    marketsCount: match.openMarketCount || match.markets.length,
    shortName: market.shortName,
    message: market.informationMessage || market.message,
    allowMulti: !!market.allowMulti,
    icon: generateSportIcon({ name: sportName }),
    onlineBetting: market.onlineBetting,
    phoneBettingOnly: market.phoneBettingOnly,
    sameGameMultipleSelections: market.sameGameMultipleSelections,
    propositions,
    navigation: {
      template: screenMatch,
      discoveryKey: (tournamentName)
        ? bffTournamentMatch : bffCompetitionMatch,
      params: {
        sportName,
        competitionName,
        tournamentName,
        matchName: match.name,
      },
    },
  };
};

const fetchMarkets = ({ activeChip, markets }) => {
  const { betOptionsCarousel, displayBetTypes } = config.getDynamicConfig();
  if (!activeChip) {
    return fetchPriorityMarkets({ displayBetTypes, markets });
  }
  const eligibleBetOptions = (betOptionsCarousel.carouselItems[activeChip]
  && betOptionsCarousel.carouselItems[activeChip].betOptions) || [];
  let eligibleMarkets = [];
  if (eligibleBetOptions.length) {
    for (let i = 0; i < eligibleBetOptions.length; i++) {
      eligibleMarkets = markets.filter(
        ({ betOption }) => (betOption || '').toLowerCase() === (eligibleBetOptions[i] || '').toLowerCase(),
      );
      if (eligibleMarkets.length) {
        break;
      }
    }
  } else {
    eligibleMarkets = markets.filter(({ betOption }) => (betOption || '').toLowerCase() === (activeChip || '').toLowerCase());
  }
  return eligibleMarkets || [];
};

const competitionMatchMapper = ({
  promotions = [],
  activeChip = '',
} = {}) => ({
  sportName,
  competitionName,
  tournamentName,
}) => (match) => {
  if (!(match.markets && match.markets.length)) {
    return null;
  }

  const { hasPreview, hasVision } = fetchVisionFlags(match);
  const eligibleMarkets = fetchMarkets({ activeChip, markets: match.markets });
  const { betOption } = eligibleMarkets.length && eligibleMarkets[0];
  const hasMultipleMarkets = eligibleMarkets.length && eligibleMarkets.length > 1;
  const type = getTemplate(betOption);
  const toPropositionData = type === 'sports.propositions.vertical' ? propositionMapper([], false, true) : propositionMapper(match.contestants, false, true);
  const markets = eligibleMarkets.map((market) => {
    let propositions = [];
    if (market.propositions && market.propositions.length) {
      propositions = market.propositions.map(toPropositionData);
    }
    return {
      cashOutEligibility: market.cashOutEligibility,
      shortName: hasMultipleMarkets ? market.shortName : undefined,
      message: market.informationMessage || market.message,
      allowMulti: !!market.allowMulti,
      onlineBetting: market.onlineBetting,
      phoneBettingOnly: market.phoneBettingOnly,
      sameGameMultipleSelections: market.sameGameMultipleSelections,
      propositions,
    };
  });
  const marketCloseTime = (markets.length && markets[0].closeTime) || match.markets[0].closeTime;

  const promoAvailable = !!promotionFinder(promotions)({
    sportName,
    competitionName,
    tournamentName,
    matchId: match.id,
    matchStartTime: match.startTime,
  });

  return {
    type,
    title: match.name,
    subTitle: tournamentName || competitionName,
    matchId: match.id,
    betOption,
    inPlay: !!match.inPlay,
    goingInPlay: !!match.goingInPlay,
    startTime: match.startTime,
    displayTime: marketCloseTime || match.closeTime || match.startTime,
    hasVision: hasPreview || hasVision,
    sameGame: match.sameGame,
    onlineBetting: markets && markets.length > 0 ? markets[0].onlineBetting : undefined,
    phoneBettingOnly: markets && markets.length > 0 ? markets[0].phoneBettingOnly : undefined,
    promoAvailable,
    marketsCount: match.openMarketCount,
    icon: generateSportIcon({ name: sportName }),
    markets,
    navigation: {
      template: screenMatch,
      discoveryKey: (tournamentName)
        ? bffTournamentMatch : bffCompetitionMatch,
      params: {
        sportName,
        competitionName,
        tournamentName,
        matchName: match.name,
      },
    },
  };
};

module.exports = {
  matchMapper,
  competitionMatchMapper,
};
