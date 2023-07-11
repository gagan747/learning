const { bffSport, bffTournament, bffCompetition } = require('../constants');
const { infoSportsSport } = require('../constants/info-keys');
const log = require('../log');
const requestCache = require('../request-cache');

const getCompetitionList = async ({
  activeCompetition,
  sportName,
  ...otherUrlParams
}) => {
  try {
    const urlParams = { sportName, ...otherUrlParams };

    const [{ competitions }] = await Promise.all([
      requestCache.fetchInfo(infoSportsSport, urlParams),
    ]);

    return {
      type: 'sports.competition.list',
      title: sportName,
      discoveryKey: bffSport,
      refreshRate: 30,
      data: competitions
        .flatMap((c) => [
          ...(c.hasMarkets ? [c] : []),
          ...c.tournaments.map((t) => ({ competitionName: c.name, ...t })),
        ])
        .map(({ competitionName, name, sameGame = false }) => ({
          name,
          displayName: name,
          competitionName,
          active: name === activeCompetition,
          sameGame,
          discoveryKey: competitionName
            ? bffTournament : bffCompetition,
        })),
    };
  } catch (e) {
    log.error(e, 'error getting competition list');
  }

  return {
    type: 'sports.competition.list',
    title: sportName,
    discoveryKey: bffSport,
    refreshRate: 30,
    data: [],
  };
};

module.exports = {
  getCompetitionList,
};
