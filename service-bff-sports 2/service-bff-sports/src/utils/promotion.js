const config = require('../config');
const { convertToISO } = require('./date');

const isPromoAvailable = (promo, matchId, matchStartTime) => {
  if (!matchStartTime) {
    return true;
  }
  const { matchIds } = promo;
  if (matchIds && matchId && matchIds.includes(matchId)) {
    return true;
  }
  const start = promo.matchStartOnOrAfter || promo.startDate;
  const end = promo.matchStartOnOrBefore || promo.endDate;
  const startDt = convertToISO(start);
  const endDt = convertToISO(end);
  return ((!startDt || startDt <= matchStartTime) && (!endDt || matchStartTime <= endDt)
  && (startDt || endDt));
};

const isPromotionWithInMatchesRange = (promo, matches) => {
  const startDt = convertToISO(promo.startDate || promo.matchStartOnOrAfter);
  const endDt = convertToISO(promo.endDate || promo.matchStartOnOrBefore);
  const todayDate = convertToISO(Date.now());
  return (
    (!startDt || startDt <= matches[0].startTime)
    && (!endDt || (
      todayDate <= matches[matches.length - 1].closeTime
      && matches[0].closeTime <= endDt
    ))
  );
};

const isPromotionAvailableForAnyCompetition = (promo, competitions) => {
  let compPromo;
  competitions.some((c) => {
    if (c.name === promo.competition) {
      compPromo = c;
      return true;
    }
    if (c.tournaments && c.tournaments.length) {
      compPromo = c.tournaments.find((t) => t.name === promo.competition);
      return true;
    }
    return false;
  });
  return compPromo ? isPromotionWithInMatchesRange(promo, compPromo.matches) : false;
};

const getPredicate = ({
  sportName,
  competitionName,
  tournamentName = '',
  matchId,
  marketName,
  matchStartTime = '',
  matches,
  competitions,
}) => {
  const { toggles: { showTournamentPromo } } = config.getDynamicConfig();

  return (promotion) => (
    promotion.sportType === sportName
    && (
      competitionName ? (
        (showTournamentPromo && promotion.competition === tournamentName)
        || promotion.competition === competitionName
      ) : true
    )
    && ((competitions && competitions.length)
      ? isPromotionAvailableForAnyCompetition(promotion, competitions) : true)
    && ((matches && matches.length) ? isPromotionWithInMatchesRange(promotion, matches) : true)
    && isPromoAvailable(promotion, matchId, matchStartTime)
    && (marketName ? promotion.marketType.toLowerCase() === marketName.toLowerCase() : true)
  );
};

const promotionFinder = (promotions = []) => (params) => promotions.find(getPredicate(params));

const promotionsFinder = (promotions = []) => (params) => promotions.filter(getPredicate(params));

module.exports = {
  promotionFinder,
  promotionsFinder,
};
