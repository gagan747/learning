const { bffTournamentMatchResults, bffCompetitionMatchResults } = require('../constants');
const { infoTournamentMatchMarketsResults, infoMatchMarketsResults } = require('../constants/info-keys');
const requestCache = require('../request-cache');
const { formatToTwoDecimalPlaces } = require('../utils');
const { orderedGrouper } = require('../utils/array');

const groupByBetOption = orderedGrouper('betOption');

const resultsGetter = (isTournament) => {
  const infoKey = isTournament ? infoTournamentMatchMarketsResults : infoMatchMarketsResults;
  const discoveryKey = isTournament ? bffTournamentMatchResults : bffCompetitionMatchResults;

  return async (urlParams) => {
    const { markets = [] } = await requestCache.fetchInfo(infoKey, urlParams);

    return {
      type: 'sports.match.results',
      title: urlParams.matchName,
      data: [...groupByBetOption(markets).entries()].map(([title, betOptionMarkets]) => ({
        title,
        data: betOptionMarkets.flatMap((m) => m.propositions).map((p) => ({
          name: p.name,
          id: p.id,
          returnWin: (p.bettingStatus !== 'Winner') ? p.bettingStatus : (formatToTwoDecimalPlaces(p.returnWin)).toString(),
        })),
      })),
      discoveryKey,
      refreshRate: 30,
    };
  };
};

const getMatchResults = resultsGetter(false);

const getTournamentMatchResults = resultsGetter(true);

module.exports = {
  getMatchResults,
  getTournamentMatchResults,
};
