const config = require('../config');
const { infoSportsNextToGoMatchesMarkets, infoSportsNextToGo } = require('../constants/info-keys');
const { recommendationLiveEvents, recommendationSportsNextToGo } = require('../constants/recommendation-keys');
const requestCache = require('../request-cache');
const { matchMapper, mapNextToGoMatch } = require('../transformers');
const utils = require('../utils');
const { fetchPromotions } = require('./promotions');

const getFlatMatches = (sport, inPlay, matches = [], promotions = []) => {
  const { displayBetTypes } = config.getDynamicConfig();
  const toMatchData = matchMapper({
    displayBetTypes,
    promotions,
  });

  sport.competitions.forEach((competition) => {
    competition.matches.forEach((match) => {
      if (match.inPlay === inPlay) {
        const _match = toMatchData({
          sportName: match.sportName,
          competitionName: match.competitionName,
        })(match);
        if (_match) {
          matches.push(_match);
        }
      }
    });
    competition.tournaments.forEach((tournament) => {
      tournament.matches.forEach((match) => {
        if (match.inPlay === inPlay) {
          const _match = toMatchData({
            sportName: match.sportName,
            competitionName: match.competitionName,
            tournamentName: match.tournamentName,
          })(match);
          if (_match) {
            matches.push(_match);
          }
        }
      });
    });
  });
  return {
    matches,
  };
};

const getFlatSports = (racingSports, promotions) => (
  sports,
  inPlay,
  matches = [],
  sportsGroup = [],
) => {
  const outRacingSports = (sport) => (!racingSports.includes(sport.id));
  sports.filter(outRacingSports).forEach((sport) => {
    const { matches: _matches } = getFlatMatches(sport, inPlay, [], promotions);
    if (_matches && _matches.length) {
      matches.push(..._matches);
      sportsGroup.push({ name: sport.name, displayName: sport.displayName });
    }
  });
  return {
    matches: utils.orderItems(matches, 'asc', 'displayTime'), groups: sportsGroup,
  };
};

const getInfoServiceUpcomingDataWithMarkets = async (
  urlParams,
  racingSports,
  promotions,
) => {
  const {
    jurisdiction, homeState, inPlay: _inPlay, sportName: _sportName,
  } = urlParams;
  const { matches } = await requestCache.fetchInfo(infoSportsNextToGoMatchesMarkets, {
    jurisdiction, homeState, limit: '49', next: '48h', sortByTime: true, liveBettingOnly: false,
  });
  const upcomingMatches = [];

  const { displayBetTypes } = config.getDynamicConfig();
  const ntgMatchMapper = matchMapper({
    displayBetTypes,
    promotions,
  });

  if (_sportName) {
    matches
      .filter(({ sportName, inPlay }) => (sportName === _sportName && inPlay === _inPlay))
      .forEach((match) => {
        upcomingMatches.push(
          ntgMatchMapper({
            sportName: match.sportName,
            competitionName: match.competitionName,
            tournamentName: match.tournamentName,
          })(match),
        );
      });
    return { matches: upcomingMatches };
  }
  matches
    .filter(({ inPlay, sportSpectrumId }) => (
      _inPlay === inPlay && !racingSports.includes(sportSpectrumId)
    ))
    .forEach((match) => {
      upcomingMatches.push(
        ntgMatchMapper({
          sportName: match.sportName,
          competitionName: match.competitionName,
          tournamentName: match.tournamentName,
        })(match),
      );
    });
  return { matches: upcomingMatches, sports: [] };
};

const getInfoServiceUpcomingData = async (
  urlParams,
  racingSports,
  promotions,
) => {
  const {
    jurisdiction, homeState, inPlay: _inPlay, sportName: _sportName,
  } = urlParams;
  const { matches } = await requestCache.fetchInfo(infoSportsNextToGo, {
    jurisdiction, homeState, limit: 'unlimited', next: '48h', sortByTime: true, liveBettingOnly: false,
  });
  const upcomingMatches = [];

  const ntgMatchMapper = mapNextToGoMatch(promotions);

  if (_sportName) {
    matches
      .filter(({ sportName, inPlay }) => (sportName === _sportName && inPlay === _inPlay))
      .forEach((match) => {
        upcomingMatches.push(ntgMatchMapper(match));
      });
    return { matches: upcomingMatches };
  }
  matches
    .filter(({ inPlay, sportSpectrumId }) => (
      _inPlay === inPlay && !racingSports.includes(sportSpectrumId)
    ))
    .forEach((match) => {
      upcomingMatches.push(ntgMatchMapper(match));
    });
  return { matches: upcomingMatches, sports: [] };
};

const getRecommendationServiceData = async (
  urlParams,
  racingSports,
  promotions,
) => {
  const {
    jurisdiction, homeState, inPlay, sportName,
  } = urlParams;
  const key = inPlay ? recommendationLiveEvents : recommendationSportsNextToGo;
  const response = await requestCache.fetchRecommendation(key, {
    jurisdiction,
    homeState,
    next: '48h',
  });
  const sports = inPlay ? response.liveMatches.sports : response.nextToGoMatches.sports;

  if (sportName) {
    const sport = sports.find(({ name }) => name === sportName);
    if (sport) {
      const { matches, _competitions } = getFlatMatches(sport, inPlay, [], promotions);
      return { matches: utils.orderItems(matches, 'asc', 'displayTime'), _competitions };
    }
    return { matches: [], _competitions: [] };
  }
  return getFlatSports(racingSports, promotions)(sports, inPlay);
};

const get = async ({
  jurisdiction,
  homeState,
  platform,
  loggedIn,
  inPlay,
  sportName,
}) => {
  const {
    racingSports,
    toggles: { useInfoNextToGo, enableMarketsInUpcomingMatches },
  } = config.getDynamicConfig();
  const urlParams = {
    jurisdiction, homeState, inPlay, sportName, platform, loggedIn,
  };

  const promotions = await fetchPromotions(urlParams);
  if (inPlay || !useInfoNextToGo) {
    return getRecommendationServiceData(urlParams, racingSports, promotions);
  }
  if (enableMarketsInUpcomingMatches) {
    return getInfoServiceUpcomingDataWithMarkets(urlParams, racingSports, promotions);
  }
  return getInfoServiceUpcomingData(urlParams, racingSports, promotions);
};

module.exports = { get };
