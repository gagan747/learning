const config = require('../config');
const { bffTournament, bffCompetition } = require('../constants');
const { infoCompetitionTournament, infoSportCompetition } = require('../constants/info-keys');
const requestCache = require('../request-cache');
const { competitionMatchMapper, matchMapper } = require('../transformers');
const {
  partition, getDateGroups, removeEmpty, compareAppVersion,
} = require('../utils');
const { fetchPromotions } = require('./promotions');

const sortMatches = (matches = []) => {
  const [winnerMatches, otherMatches] = partition(
    matches,
    (match) => (match.betOption || '').toLowerCase() === 'winner',
  );
  winnerMatches.sort(
    (a, b) => new Date(a.displayTime) - new Date(b.displayTime)
    || a.title.localeCompare(b.title),
  );
  otherMatches.sort(
    (a, b) => new Date(a.displayTime) - new Date(b.displayTime)
    || a.title.localeCompare(b.title),
  );
  return [...winnerMatches, ...otherMatches];
};

const betExists = (incomingBetOptions, betOptions) => {
  let doesExist = false;
  for (let i = 0; i < betOptions.length; i++) {
    if (incomingBetOptions.includes(betOptions[i].toLowerCase())) {
      doesExist = true;
      break;
    }
  }
  return doesExist;
};

const getFilters = (urlParams, betOptionPriority) => {
  const betOptionsPriorityLowerCase = betOptionPriority.map((x) => x.toLowerCase());
  const { betOptionsCarousel } = config.getDynamicConfig();
  const filters = [];
  const discoveryKey = urlParams.tournamentName ? bffTournament : bffCompetition;
  const { activeChip, sportName } = urlParams;
  const sport = sportName.toLowerCase();
  const betOptionFilters = (betOptionsCarousel.sports[sport]
    && betOptionsCarousel.sports[sport].carouselItems) || [];
  betOptionFilters.forEach((betOption) => {
    const betType = betOptionsCarousel.carouselItems[betOption];
    const extendedBetOptions = (betType && betType.betOptions) || [];
    const addFilter = extendedBetOptions.length
      ? betExists(betOptionsPriorityLowerCase, extendedBetOptions)
      : betOptionsPriorityLowerCase.includes(betOption.toLowerCase());
    if (addFilter) {
      filters.push({
        title:
          (betType
          && betType.title) || betOption,
        name: betOption,
        discoveryKey,
        active: activeChip
          ? (activeChip || '').toLowerCase() === (betOption || '').toLowerCase() : filters.length === 0,
      });
    }
  });
  return filters;
};

const getCompetitionBetOptions = async (urlParams) => {
  const {
    defaultOddsCount,
    oddsCountBuffer,
  } = config.getDynamicConfig();
  const key = urlParams.tournamentName ? infoCompetitionTournament : infoSportCompetition;
  const { activeChip, version } = urlParams;
  const { betTypeFiltersMinAppVersion, displayBetTypes } = config.getDynamicConfig();
  let filters;
  const compValue = compareAppVersion(version, betTypeFiltersMinAppVersion);

  const [{ matches, betOptionPriority = [] }, promotions] = await Promise.all([
    requestCache.fetchInfo(key, urlParams),
    fetchPromotions(urlParams),
  ]);
  if (compValue >= 0) {
    filters = getFilters(urlParams, betOptionPriority);
  }

  const [inPlayMatches, upcomingMatches] = partition(matches, (m) => m.inPlay);
  const toMatchData = compValue >= 0 ? competitionMatchMapper({
    promotions,
    activeChip: activeChip || (filters[0] && filters[0].name),
  })(urlParams) : matchMapper({
    displayBetTypes,
    promotions,
  })(urlParams);
  const inPlayMatchesData = inPlayMatches.map(toMatchData).filter(removeEmpty);
  const upcomingMatchesData = upcomingMatches.map(toMatchData).filter(removeEmpty);

  return {
    type: 'sports.competition.betOptions',
    defaultOddsCount,
    oddsCountBuffer,
    filters,
    data: [
      {
        title: 'In-Play',
        data: sortMatches(inPlayMatchesData),
      },
      getDateGroups({
        matches: sortMatches(upcomingMatchesData),
        includeFutures: true,
        futureFormat: {
          thisYear: 'EEEE dd MMM',
          nextYear: 'EEEE dd MMM yyyy',
        },
        sortingRequired: false,
        version,
      }),
    ].filter((d) => d.data.length),
  };
};

module.exports = {
  getCompetitionBetOptions,
};
