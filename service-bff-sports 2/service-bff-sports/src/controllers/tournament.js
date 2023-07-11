const { getCompetitionBetOptions } = require('../services/competition-bet-options');
const { getCompetitionList } = require('../services/competition-list');
const { getTournamentResults } = require('../services/competition-results');
const { getEligiblePromotions, fetchPromotions } = require('../services/promotions');
const { getCompetitionData, getPromoData } = require('../transformers');
const errorHandlers = require('../utils/error-handlers');

const results = async (req, res) => {
  try {
    const { sportName, competitionName, tournamentName } = req.params;
    const { jurisdiction, homeState } = req.query;

    const tournamentResults = await getTournamentResults({
      sportName,
      competitionName,
      tournamentName,
      jurisdiction,
      homeState,
    });

    return res.json(tournamentResults);
  } catch (e) {
    return errorHandlers.handleError(e, res, 'Error fetching Tournament results.');
  }
};

const page = async (req, res) => {
  try {
    const { sportName, competitionName, tournamentName } = req.params;
    const {
      jurisdiction, homeState, platform, loggedIn = '', activeChip = '', version,
    } = req.query;

    const [competitionList, promotions = [], betOptions = {}] = await Promise.all([
      getCompetitionList({
        sportName,
        jurisdiction,
        homeState,
        activeCompetition: tournamentName,
      }),
      fetchPromotions({
        jurisdiction,
        homeState,
        sportName,
        competitionName,
        tournamentName,
        platform,
        loggedIn,
      }),
      getCompetitionBetOptions({
        sportName,
        competitionName,
        tournamentName,
        jurisdiction,
        homeState,
        platform,
        loggedIn,
        activeChip,
        version,
      }),
    ]);

    const matches = (betOptions.data || []).flatMap((item) => item.data);
    const eligiblePromotions = getEligiblePromotions(promotions, matches, {
      jurisdiction,
      homeState,
      sportName,
      competitionName,
      tournamentName,
      platform,
      loggedIn,
    });
    const compData = getCompetitionData(competitionList, eligiblePromotions);
    const promoData = getPromoData(eligiblePromotions);

    return res.json({
      type: 'sports.sport.competition',
      sportName,
      title: tournamentName,
      data: [{
        ...competitionList,
        data: compData || [],
      }, promoData, betOptions].filter(Boolean),
    });
  } catch (e) {
    return errorHandlers.handleError(e, res, 'Error fetching tournament details.');
  }
};

module.exports = {
  results,
  page,
};
