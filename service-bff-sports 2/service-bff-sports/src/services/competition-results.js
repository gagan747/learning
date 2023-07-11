const {
  bffTournamentMatchResults,
  bffCompetitionMatchResults,
  screenMatchResults,
  bffTournamentResults,
  bffCompetitionResults,
} = require('../constants');
const { infoCompetitionMatchesResults, infoTournamentMatchesResults } = require('../constants/info-keys');
const requestCache = require('../request-cache');
const { orderItems } = require('../utils');

const resultsGetter = (isTournament) => async ({
  sportName,
  competitionName,
  tournamentName,
  jurisdiction,
  homeState,
}) => {
  const infoWiftKey = isTournament ? infoTournamentMatchesResults : infoCompetitionMatchesResults;

  const urlParams = {
    sportName,
    competitionName,
    tournamentName,
    jurisdiction,
    homeState,
  };

  const { matches = [] } = await requestCache.fetchInfo(infoWiftKey, urlParams);

  return {
    type: 'sports.competition.results',
    title: `${isTournament ? tournamentName : competitionName} Results`,
    data: orderItems(matches)
      .map(({ name, spectrumId }) => ({
        name,
        displayName: name,
        spectrumId,
        navigation: {
          template: screenMatchResults,
          discoveryKey: isTournament
            ? bffTournamentMatchResults : bffCompetitionMatchResults,
          params: {
            sportName,
            competitionName,
            tournamentName: isTournament ? tournamentName : undefined,
            matchName: name,
          },
        },
      })),
    discoveryKey: isTournament ? bffTournamentResults : bffCompetitionResults,
    refreshRate: 30,
  };
};

const getCompetitionResults = resultsGetter(false);

const getTournamentResults = resultsGetter(true);

module.exports = {
  getCompetitionResults,
  getTournamentResults,
};
