const {
  getMatchPage,
  getMatchMarkets,
  getMatchSameGameMulti,
} = require('../services/match');
const { getTournamentMatchResults } = require('../services/match-results');
const errorHandlers = require('../utils/error-handlers');

const page = async (req, res) => {
  try {
    const {
      params: {
        sportName,
        competitionName,
        tournamentName,
        matchName,
      },
      query: {
        jurisdiction,
        homeState,
        activeTab,
        referrer,
        version,
        platform,
        loggedIn,
      },
    } = req;

    const matchPage = await getMatchPage({
      sportName,
      competitionName,
      tournamentName,
      matchName,
      jurisdiction,
      homeState,
      activeTab,
      referrer,
      platform,
      version,
      loggedIn,
    });

    return res.json(matchPage);
  } catch (e) {
    return errorHandlers.handleError(e, res);
  }
};

const markets = async (req, res) => {
  try {
    const {
      sportName, competitionName, tournamentName, matchName,
    } = req.params;
    const { jurisdiction, homeState } = req.query;

    const matchMarkets = await getMatchMarkets({
      sportName,
      competitionName,
      tournamentName,
      matchName,
      jurisdiction,
      homeState,
    });

    return res.json(matchMarkets);
  } catch (e) {
    return errorHandlers.handleError(e, res);
  }
};

const sameGameMulti = async (req, res) => {
  try {
    const {
      sportName, competitionName, tournamentName, matchName,
    } = req.params;
    const { jurisdiction, homeState } = req.query;

    const matchSameGameMulti = await getMatchSameGameMulti({
      sportName,
      competitionName,
      tournamentName,
      matchName,
      jurisdiction,
      homeState,
    });

    return res.json(matchSameGameMulti);
  } catch (e) {
    return errorHandlers.handleError(e, res);
  }
};

const results = async (req, res) => {
  const {
    params: {
      sportName,
      competitionName,
      tournamentName,
      matchName,
    },
    query: {
      jurisdiction,
      homeState,
    },
  } = req;

  try {
    const matchResults = await getTournamentMatchResults({
      sportName,
      competitionName,
      tournamentName,
      matchName,
      jurisdiction,
      homeState,
    });

    return res.json(matchResults);
  } catch (e) {
    return errorHandlers.handleError(e, res, 'Error fetching tournament match results.');
  }
};

module.exports = {
  page,
  markets,
  sameGameMulti,
  results,
};
