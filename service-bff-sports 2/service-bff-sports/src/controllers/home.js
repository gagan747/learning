const config = require('../config');
const {
  bffSportsAll, bffSportsUpcoming, bffSportsInPlay, bffSportsResults, screenSportResults,
} = require('../constants');
const { infoSports, infoSportsResults } = require('../constants/info-keys');
const requestCache = require('../request-cache');
const { getCarouselIcon } = require('../services/home-cms');
const { fetchPromotions } = require('../services/promotions');
const upcomingInPlay = require('../services/upcomingInPlay');
const { getAZList, getCompetitions, formatItems } = require('../transformers/sports');
const { formatHomeUpcomingInPlayChips } = require('../transformers/upcomingInPlay');
const { getDateGroups } = require('../utils');
const errorHandlers = require('../utils/error-handlers');

const page = async (req, res) => {
  try {
    const {
      jurisdiction,
      homeState,
      platform = 'mobile',
      activeTab = 'sports',
      loggedIn = 'false',
    } = req.query;

    const {
      enableHomeInplay,
      enableHomeResults,
      enableQuicklinkCarousel,
    } = config.getDynamicConfig().toggles;

    const [{ sports }, promotions, carouselIcon] = await Promise.all([
      requestCache.fetchInfo(infoSports, { jurisdiction, homeState, matchDetails: true }),
      fetchPromotions({
        jurisdiction, platform, homeState, loggedIn,
      }),
      enableQuicklinkCarousel && getCarouselIcon({
        'authentication-status': loggedIn.toLowerCase() === 'true' ? 'logged-in' : 'logged-out',
        jurisdiction,
        platform,
        homeState,
      }),
    ]);

    const featuredSports = getCompetitions(sports, promotions);

    const carouselText = {
      type: 'sports.carousel.text',
      data: [
        {
          type: 'sports.home.tab',
          title: 'All Sports',
          tab: 'sports',
          discoveryKey: bffSportsAll,
          active: activeTab === 'sports',
          data: [featuredSports, getAZList(promotions)(sports, { includeSameGame: true })],
          refreshRate: 30,
        },
        {
          title: 'Upcoming',
          tab: 'upcoming',
          discoveryKey: bffSportsUpcoming,
          active: activeTab === 'upcoming',
        },
      ],
    };

    if (enableHomeInplay) {
      carouselText.data.push({
        title: 'In-Play',
        tab: 'inPlay',
        discoveryKey: bffSportsInPlay,
        active: activeTab === 'inPlay',
      });
    }

    if (enableHomeResults) {
      carouselText.data.push({
        title: 'Results',
        tab: 'results',
        discoveryKey: bffSportsResults,
        active: activeTab === 'results',
      });
    }

    return res.json({
      type: 'sports.home',
      data: carouselIcon ? [carouselIcon, carouselText] : [carouselText],
    });
  } catch (e) {
    return errorHandlers.handleError(e, res);
  }
};

const sports = async (req, res) => {
  try {
    const {
      jurisdiction, homeState, platform, loggedIn,
    } = req.query;

    const [{ sports: _sports }, promotions] = await Promise.all([
      requestCache.fetchInfo(infoSports, { jurisdiction, homeState, matchDetails: true }),
      fetchPromotions({
        jurisdiction, platform, homeState, loggedIn,
      }),
    ]);
    const featuredSports = getCompetitions(_sports, promotions);

    return res.json({
      type: 'sports.home.tab',
      data: [featuredSports, getAZList(promotions)(_sports, { includeSameGame: true })],
      discoveryKey: bffSportsAll,
      refreshRate: 30,
    });
  } catch (e) {
    return errorHandlers.handleError(e, res);
  }
};

const results = async (req, res) => {
  try {
    const { jurisdiction, homeState } = req.query;
    const {
      sports: _sports,
    } = await requestCache.fetchInfo(infoSportsResults, { jurisdiction, homeState });
    const sportsData = _sports.map(({ name, displayName, spectrumId }) => ({
      sportName: name,
      displayName,
      spectrumId,
    }));
    return res.json({
      type: 'sports.home.results',
      data: formatItems()(sportsData, { template: screenSportResults, includeSameGame: false }),
      discoveryKey: bffSportsResults,
      refreshRate: 30,
    });
  } catch (e) {
    return errorHandlers.handleError(e, res, 'Error fetching results.');
  }
};

const upcoming = async (req, res) => {
  try {
    const {
      jurisdiction, homeState, platform, loggedIn, version,
    } = req.query;
    const { matches, groups } = await upcomingInPlay.get({
      jurisdiction,
      homeState,
      platform,
      loggedIn,
      inPlay: false,
    });
    const upcomingMatches = getDateGroups({
      matches,
      includeFutures: true,
      maxSize: 50,
      version,
    });

    return res.json({
      type: 'sports.home.upcoming',
      data: [{
        type: 'sports.home.upcoming.chips',
        data: formatHomeUpcomingInPlayChips(groups, upcomingMatches, false),
      }],
      discoveryKey: bffSportsUpcoming,
      refreshRate: 30,
    });
  } catch (e) {
    return errorHandlers.handleError(e, res, 'Error fetching Upcoming matches.');
  }
};

const inPlay = async (req, res) => {
  try {
    const {
      jurisdiction, homeState, platform, loggedIn,
    } = req.query;
    const { matches, groups } = await upcomingInPlay.get({
      jurisdiction,
      homeState,
      platform,
      loggedIn,
      inPlay: true,
    });

    return res.json({
      type: 'sports.home.inplay',
      data: [{
        type: 'sports.home.inplay.chips',
        data: formatHomeUpcomingInPlayChips(groups, matches, true),
      }],
      discoveryKey: bffSportsInPlay,
      refreshRate: 30,
    });
  } catch (e) {
    return errorHandlers.handleError(e, res, 'Error fetching In-Play matches.');
  }
};

module.exports = {
  page,
  sports,
  results,
  upcoming,
  inPlay,
};
