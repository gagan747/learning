const { getCompetitionBetOptions } = require('../services/competition-bet-options');
const { getCompetitionList } = require('../services/competition-list');
const { getCompetitionResults } = require('../services/competition-results');
const { fetchPromotions, getEligiblePromotions } = require('../services/promotions');
const { getCompetitionData, getPromoData } = require('../transformers');
const errorHandlers = require('../utils/error-handlers');

const results = async (req, res) => {
  try {
    const { sportName, competitionName } = req.params;
    const { jurisdiction, homeState } = req.query;

    const competitionResults = await getCompetitionResults({
      sportName,
      competitionName,
      jurisdiction,
      homeState,
    });

    return res.json(competitionResults);
  } catch (e) {
    return errorHandlers.handleError(e, res, 'Error fetching Competition results.');
  }
};

const page = async (req, res) => {
  try {
    const { sportName, competitionName } = req.params;
    const {
      jurisdiction, homeState, platform, loggedIn = '', activeChip = '', version,
    } = req.query;

    const [competitionList, promotions = [], betOptions = {}] = await Promise.all([
      getCompetitionList({
        sportName,
        jurisdiction,
        homeState,
        platform,
        loggedIn,
        activeCompetition: competitionName,
      }),
      fetchPromotions({
        jurisdiction,
        homeState,
        sportName,
        competitionName,
        platform,
        loggedIn,
      }),
      getCompetitionBetOptions({
        sportName,
        competitionName,
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
      platform,
      loggedIn,
    });
    const compData = getCompetitionData(competitionList, eligiblePromotions);
    const promoData = getPromoData(eligiblePromotions);

    return res.json({
      type: 'sports.sport.competition',
      sportName,
      title: competitionName,
      data: [
        {
          ...competitionList,
          data: compData || [],
        },
        promoData,
        betOptions,
      ].filter(Boolean),
    });
  } catch (e) {
    return errorHandlers.handleError(e, res, 'Error fetching Competition details.');
  }
};

module.exports = {
  results,
  page,
};
