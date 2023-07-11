const config = require('../config');
const {
  screenSport,
  screenSportResults,
  screenCompetitionResults,
  screenTournament,
  screenCompetition,
  screenMatch,
  bffSport,
  bffSportResults,
  bffTournamentResults,
  bffCompetitionResults,
  bffTournament,
  bffCompetition,
  bffTournamentMatch,
  bffCompetitionMatch,
} = require('../constants');
const { byDisplayName, generateSportIcon, promotionFinder } = require('../utils');

// exclude sports that are part of racing
const excludeRacingSports = (sports) => (
  sports.filter((s) => !config.getDynamicConfig().racingSports.includes(s.spectrumId))
);

const formatItems = (promotions) => (
  items,
  { template, includeSameGame, includeIcon = true } = {},
) => (
  items.map(({
    displayName,
    name,
    sportName = name,
    competitionName,
    tournamentName,
    spectrumId,
    sameGame,
    competitions,
  }) => {
    const keys = {
      [screenSport]: bffSport,
      [screenSportResults]: bffSportResults,
      [screenCompetitionResults]: tournamentName
        ? bffTournamentResults : bffCompetitionResults,
    };
    const discoveryKey = keys[template];

    const promoAvailable = !!promotionFinder(promotions)({
      sportName,
      competitionName,
      competitions,
    });

    return {
      displayName: tournamentName || competitionName || displayName,
      spectrumId,
      sameGame: includeSameGame ? !!sameGame : undefined,
      promoAvailable,
      icon: includeIcon ? generateSportIcon({
        name: sportName,
        keepOriginalColor: true,
      }) : undefined,
      navigation: {
        params: {
          sportName,
          competitionName,
          tournamentName,
        },
        template,
        discoveryKey,
      },
    };
  })
);

const getAZList = (promotions = []) => (items, {
  template = screenSport,
  title = 'A - Z',
  needsExcludeRacingSports = true,
  includeSameGame = false,
} = {}) => {
  const _items = needsExcludeRacingSports ? excludeRacingSports(items) : items;
  return {
    title,
    data: formatItems(promotions)(_items, { template, includeSameGame })
      .sort(byDisplayName),
  };
};
const addMatchNavigation = ({ competition, tournament }) => {
  let matchNavigation = {};
  const { matches = [] } = competition;
  const { tMatches = [] } = tournament;
  if (matches.length === 1) {
    matchNavigation = {
      matchName: matches[0].name,
      matchTemplate: screenMatch,
      matchDiscovery: bffCompetitionMatch,
    };
  } else if (tMatches.length === 1) {
    matchNavigation = {
      matchName: tMatches[0].name,
      matchTemplate: screenMatch,
      matchDiscovery: bffTournamentMatch,
    };
  }
  return matchNavigation;
};

const getCompetitions = (sports, promotions = []) => {
  const { featureLimit, todaysOffers, racingSports } = config.getDynamicConfig();
  const outRacingSportsAndTodaysOffers = (sport) => (
    !racingSports.includes(sport.spectrumId) && sport.spectrumId !== todaysOffers
  );
  const competitionList = [];
  sports
    .filter(outRacingSportsAndTodaysOffers)
    .slice(0, featureLimit)
    .forEach((sport) => {
      const sportName = sport.name;
      const competition = sport.competitions[0];
      const competitionName = competition.name;
      let tournamentName;

      if (competition.tournaments && competition.tournaments.length === 1) {
        tournamentName = competition.tournaments[0].name;
      }

      const promoAvailable = !!promotionFinder(promotions)({
        sportName,
        competitionName,
        tournamentName,
        matches: tournamentName ? competition.tournaments[0].matches : competition.matches,
      });

      const {
        matchName,
        matchTemplate,
        matchDiscovery,
      } = addMatchNavigation({
        competition,
        tournament: tournamentName ? competition.tournaments[0] : {},
      });

      // TO DO: sameGame is currently not available for tournaments.
      competitionList.push({
        displayName: tournamentName || competitionName,
        sameGame: !!competition.sameGame,
        promoAvailable,
        icon: generateSportIcon({ name: sportName, keepOriginalColor: true }),
        navigation: {
          params: {
            sportName,
            competitionName,
            ...(matchName && { matchName }),
            ...(tournamentName && { tournamentName }),
          },
          template: matchTemplate || (tournamentName ? screenTournament : screenCompetition),
          discoveryKey: matchDiscovery || (tournamentName ? bffTournament : bffCompetition),
        },
      });
    });

  return {
    title: 'Featured',
    data: competitionList,
  };
};

module.exports = {
  getCompetitions,
  getAZList,
  excludeRacingSports,
  formatItems,
};
