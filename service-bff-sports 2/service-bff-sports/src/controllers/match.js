const {
  getMatchPage,
  getMatchMarkets,
  getMatchSameGameMulti,
} = require('../services/match');
const { getMatchResults } = require('../services/match-results');
const errorHandlers = require('../utils/error-handlers');

const page = async (req, res) => {
  try {
    const {
      params: {
        sportName,
        competitionName,
        matchName,
      },
      query: {
        jurisdiction,
        homeState,
        activeTab,
        referrer,
        loggedIn,
        version,
        platform,
      },
    } = req;

    const matchPage = await getMatchPage({
      sportName,
      competitionName,
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
    const { sportName, competitionName, matchName } = req.params;
    const { jurisdiction, homeState, version } = req.query;

    const matchMarkets = await getMatchMarkets({
      sportName,
      competitionName,
      matchName,
      jurisdiction,
      homeState,
      version,
    });

    return res.json(matchMarkets);
  } catch (e) {
    return errorHandlers.handleError(e, res, 'Error fetching Match markets.');
  }
};

const sameGameMulti = async (req, res) => {
  try {
    const { sportName, competitionName, matchName } = req.params;
    const { jurisdiction, homeState, version } = req.query;

    const matchSameGameMulti = await getMatchSameGameMulti({
      sportName,
      competitionName,
      matchName,
      jurisdiction,
      version,
      homeState,
    });

    return res.json(matchSameGameMulti);
  } catch (e) {
    return errorHandlers.handleError(e, res, 'Error fetching SGM details.');
  }
};

const results = async (req, res) => {
  const {
    params: {
      sportName,
      competitionName,
      matchName,
    },
    query: {
      jurisdiction,
      homeState,
    },
  } = req;

  try {
    const matchResults = await getMatchResults({
      sportName,
      competitionName,
      matchName,
      jurisdiction,
      homeState,
    });

    return res.json(matchResults);
  } catch (e) {
    return errorHandlers.handleError(e, res, 'Error fetching Match results.');
  }
};

module.exports = {
  page,
  markets,
  sameGameMulti,
  results,
};
