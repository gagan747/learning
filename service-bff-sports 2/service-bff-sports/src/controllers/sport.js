const config = require('../config');
const {
  bffSportAll,
  bffSportUpcoming,
  bffSportInPlay,
  screenCompetitionResults,
  bffSportResults,
  bffSportFeatured,
} = require('../constants');
const { infoSportResults } = require('../constants/info-keys');
const requestCache = require('../request-cache');
const { getFeaturedSportData } = require('../services/featured');
const { getAllSportData } = require('../services/sport');
const upcomingInPlay = require('../services/upcomingInPlay');
const { formatItems } = require('../transformers/sports');
const { formatSportUpcomingInPlayChips } = require('../transformers/upcomingInPlay');
const { getDateGroups } = require('../utils');
const errorHandlers = require('../utils/error-handlers');

const page = async (req, res) => {
  const {
    params: {
      sportName,
    },
    query: {
      jurisdiction, homeState, platform, loggedIn,
    },
  } = req;

  const urlParams = {
    sportName,
    jurisdiction,
    homeState,
    platform,
    loggedIn,
    matchDetails: true,
  };

  const {
    enableSportFeatured,
    enableSportUpcoming,
    enableSportInplay,
  } = config.getDynamicConfig().toggles;

  try {
    const { displayName, data } = enableSportFeatured
      ? await getFeaturedSportData(urlParams)
      : await getAllSportData(urlParams);

    const carousetTextData = enableSportFeatured
      ? [
        {
          title: 'Featured',
          tab: 'featured',
          discoveryKey: bffSportFeatured,
          active: true,
          data,
        },
        {
          title: `All ${displayName}`,
          tab: 'competitions',
          discoveryKey: bffSportAll,
          active: false,
          refreshRate: 30,
        },
      ]
      : [
        {
          title: `All ${displayName}`,
          tab: 'competitions',
          discoveryKey: bffSportAll,
          active: true,
          data,
          refreshRate: 30,
        },
      ];

    if (enableSportUpcoming) {
      carousetTextData.push({
        title: 'Upcoming',
        tab: 'upcoming',
        discoveryKey: bffSportUpcoming,
        active: false,
      });
    }
    if (enableSportInplay) {
      carousetTextData.push({
        title: 'In-Play',
        tab: 'inPlay',
        discoveryKey: bffSportInPlay,
        active: false,
      });
    }
    return res.json({
      type: 'sports.sport',
      title: displayName,
      data: [
        {
          type: 'sports.carousel.text',
          data: carousetTextData,
        }],
    });
  } catch (e) {
    return errorHandlers.handleError(e, res);
  }
};

const sport = async (req, res) => {
  const {
    params: {
      sportName,
    },
    query: {
      jurisdiction, homeState, platform, loggedIn,
    },
  } = req;

  try {
    const { displayName, data } = await getAllSportData({
      sportName, jurisdiction, homeState, platform, loggedIn, matchDetails: true,
    });

    return res.json({
      type: 'sports.sport.tab',
      title: `All ${displayName}`,
      data,
      discoveryKey: bffSportAll,
      refreshRate: 30,
    });
  } catch (e) {
    return errorHandlers.handleError(e, res);
  }
};

const results = async (req, res) => {
  try {
    const { jurisdiction, homeState } = req.query;
    const { sportName } = req.params;
    const urlParams = { sportName, jurisdiction, homeState };
    const {
      displayName: _displayName,
      competitions: _competitions,
    } = await requestCache.fetchInfo(infoSportResults, urlParams);
    const items = _competitions.reduce((acc, _comp) => {
      const competitionName = _comp.name;
      if (_comp.tournaments && _comp.tournaments.length) {
        _comp.tournaments.forEach(({ spectrumId, name }) => {
          acc.push({
            sportName,
            competitionName,
            tournamentName: name,
            spectrumId,
          });
        });
      } else {
        acc.push({
          sportName,
          competitionName,
          spectrumId: _comp.spectrumId,
        });
      }
      return acc;
    }, []);
    return res.json({
      type: 'sports.sport.results',
      title: `${_displayName} Results`,
      data: formatItems()(items, {
        template: screenCompetitionResults,
        includeSameGame: false,
        includeIcon: false,
      }),
      discoveryKey: bffSportResults,
      refreshRate: 30,
    });
  } catch (e) {
    return errorHandlers.handleError(e, res);
  }
};

const upcoming = async (req, res) => {
  try {
    const {
      jurisdiction, homeState, platform, loggedIn, version,
    } = req.query;
    const { sportName } = req.params;
    const { matches } = await upcomingInPlay.get({
      jurisdiction,
      homeState,
      sportName,
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
      type: 'sports.sport.upcoming',
      data: [{
        type: 'sports.sport.upcoming.chips',
        data: formatSportUpcomingInPlayChips(sportName, upcomingMatches, false),
      }],
      discoveryKey: bffSportUpcoming,
      refreshRate: 30,
    });
  } catch (e) {
    return errorHandlers.handleError(e, res);
  }
};

const inPlay = async (req, res) => {
  try {
    const {
      jurisdiction, homeState, platform, loggedIn,
    } = req.query;
    const { sportName } = req.params;
    const { matches } = await upcomingInPlay.get({
      jurisdiction,
      homeState,
      sportName,
      platform,
      loggedIn,
      inPlay: true,
    });

    return res.json({
      type: 'sports.sport.inplay',
      data: [{
        type: 'sports.sport.inplay.chips',
        data: formatSportUpcomingInPlayChips(sportName, matches, true),
      }],
      discoveryKey: bffSportInPlay,
      refreshRate: 30,
    });
  } catch (e) {
    return errorHandlers.handleError(e, res);
  }
};

const featured = async (req, res) => {
  const {
    params: {
      sportName,
    },
    query: {
      jurisdiction, homeState, platform, loggedIn,
    },
  } = req;
  try {
    const { data } = await getFeaturedSportData({
      sportName,
      jurisdiction,
      homeState,
      platform,
      loggedIn,
    });

    return res.json({
      type: 'sports.sport.featured',
      discoveryKey: bffSportFeatured,
      data,
    });
  } catch (e) {
    return errorHandlers.handleError(e, res);
  }
};

module.exports = {
  page,
  sport,
  results,
  upcoming,
  inPlay,
  featured,
};
