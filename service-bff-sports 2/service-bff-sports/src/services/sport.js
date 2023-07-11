const {
  screenCompetition,
  bffCompetition,
  screenTournament,
  bffTournament,
  screenMatch,
  bffCompetitionMatch,
  bffTournamentMatch,
} = require('../constants');
const { infoSportsSport } = require('../constants/info-keys');
const requestCache = require('../request-cache');
const { promotionFinder } = require('../utils');
const { fetchPromotions } = require('./promotions');

const addMatchNavigation = (item, isTournament) => {
  let matchNavigation = {};
  if (item.matches && item.matches.length === 1) {
    matchNavigation = {
      matchName: item.matches[0].name,
      matchTemplate: screenMatch,
      matchDiscovery: isTournament ? bffTournamentMatch : bffCompetitionMatch,
    };
  }
  return matchNavigation;
};

const formatCompetition = (item, {
  sportName,
  competitionName,
  tournamentName,
  promoAvailable,
}) => {
  const { matchName, matchTemplate, matchDiscovery } = addMatchNavigation(item, tournamentName);
  return {
    displayName: item.name,
    spectrumId: item.spectrumId,
    sameGame: item.sameGame || false,
    promoAvailable,
    navigation: {
      params: {
        sportName,
        competitionName,
        tournamentName,
        ...(matchName && { matchName }),
      },
      template: matchTemplate || (tournamentName ? screenTournament : screenCompetition),
      discoveryKey: matchDiscovery || (tournamentName ? bffTournament : bffCompetition),
    },
  };
};

const competitionParser = (findPromotions = []) => (sportName) => (competition) => {
  const list = [];
  if (competition.hasMarkets) {
    const promoAvailable = !!findPromotions({
      sportName,
      competitionName: competition.name,
      matches: competition && (competition.matches || []),
    });
    list.push(formatCompetition(competition, {
      promoAvailable,
      sportName,
      competitionName: competition.name,
    }));
  }
  competition.tournaments.forEach((tourn) => {
    const promoAvailable = !!findPromotions({
      sportName,
      competitionName: competition.name,
      tournamentName: tourn.name,
      matches: tourn && (tourn.matches || []),
    });
    list.push(formatCompetition(tourn, {
      promoAvailable,
      sportName,
      competitionName: competition.name,
      tournamentName: tourn.name,
    }));
  });
  return list;
};

const getAllSportData = async (urlParams) => {
  const allSport = await requestCache.fetchInfo(infoSportsSport, urlParams);

  if (!allSport || !allSport.competitions || !allSport.competitions.length) {
    return [];
  }

  const promotions = await fetchPromotions(urlParams);

  const findPromotions = promotionFinder(promotions);
  const toParsedCompetition = competitionParser(findPromotions)(urlParams.sportName);
  const data = allSport.competitions.flatMap(toParsedCompetition);

  return {
    displayName: allSport.displayName,
    data,
  };
};

module.exports = {
  getAllSportData,
};
