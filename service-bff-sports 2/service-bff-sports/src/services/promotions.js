const newrelic = require('newrelic');

const config = require('../config');
const log = require('../log');
const requestCache = require('../request-cache');
const { toPromoHtmlPage } = require('../transformers');
const { promotionsFinder, convertToISO } = require('../utils');

const getAuthStatus = (loggedIn = '') => (
  loggedIn.toLowerCase() === 'true' ? 'logged-in' : 'logged-out'
);

const fetchPromotions = async ({
  jurisdiction, platform, homeState, loggedIn,
}) => {
  try {
    const response = await requestCache.fetchAem('promo', {
      jurisdiction,
      platform,
      homeState,
      authenticationStatus: getAuthStatus(loggedIn),
    });

    if (!(response && response.items && response.items.length)) {
      return [];
    }

    return response.items.filter(({ item }) => (
      item.jurisdiction.includes(jurisdiction.toLowerCase())
      && item.authenticationStatus.includes(getAuthStatus(loggedIn))
    )).map(({ item }) => item);
  } catch (e) {
    log.error(e, 'aem failed');
    newrelic.noticeError(e);
  }
  return [];
};

const getPromoBanner = async (params) => {
  const promotions = await fetchPromotions(params);
  const promoItems = promotionsFinder(promotions)(params);

  if (!promoItems || !promoItems.length) {
    return undefined;
  }

  const { promoBannerTimer: timer } = config.getDynamicConfig();
  const data = promoItems.map((promoItem) => ({
    icon: {
      appIconIdentifier: 'app_promo_offers',
      imageURL: '',
      keepOriginalColor: true,
    },
    promoText: promoItem.promoDetails,
    promoDetails: toPromoHtmlPage(promoItem),
  }));

  return {
    type: params.matchId ? 'sports.match.promo' : 'sports.competition.promo',
    timer,
    data,
  };
};

const isWithinDateRange = (promo) => (match) => {
  const { startTime } = match;
  const { matchIds } = promo;
  if (matchIds && match.matchId && matchIds.includes(match.matchId)) {
    return true;
  }
  const start = promo.matchStartOnOrAfter || promo.startDate;
  const end = promo.matchStartOnOrBefore || promo.endDate;
  const startDt = convertToISO(start);
  const endDt = convertToISO(end);
  return ((!startDt || startDt <= startTime) && (!endDt || startTime <= endDt)
  && (startDt || endDt));
};

const getPromoItems = (promotions = [], matches = [], params = {}) => {
  const { toggles: { showTournamentPromo } } = config.getDynamicConfig();
  const { sportName, competitionName, tournamentName } = params;
  const shortlistedPromos = promotions.filter((promotion) => (
    promotion.sportType === sportName
    && (
      competitionName ? (
        (showTournamentPromo && tournamentName && promotion.competition === tournamentName)
        || promotion.competition === competitionName
      ) : true
    )
  )) || [];
  const promoItems = shortlistedPromos.filter((promo) => (matches.some(isWithinDateRange(promo))));
  return promoItems || [];
};

const getEligiblePromotions = (promotions = [], matches = [], params = {}) => {
  const { promoBannerTimer: timer } = config.getDynamicConfig();

  const promoItems = getPromoItems(promotions, matches, params);

  if (!promoItems || !promoItems.length) {
    return undefined;
  }

  const data = promoItems.map((promoItem) => ({
    icon: {
      appIconIdentifier: 'app_promo_offers',
      imageURL: '',
      keepOriginalColor: true,
    },
    promoText: promoItem.promoDetails,
    promoDetails: toPromoHtmlPage(promoItem),
    competitionName: promoItem.competition,
  }));

  return {
    type: params.matchId ? 'sports.match.promo' : 'sports.competition.promo',
    timer,
    data,
  };
};

module.exports = {
  getPromoBanner,
  fetchPromotions,
  getEligiblePromotions,
};
