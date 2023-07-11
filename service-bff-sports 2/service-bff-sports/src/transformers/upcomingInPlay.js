const config = require('../config');
const {
  bffCompetitionInPlay,
  bffCompetitionUpcoming,
  bffSportInPlay,
  bffSportUpcoming,
  bffSportsInPlay,
  bffSportsUpcoming,
} = require('../constants');
const { fieldSorter } = require('../utils');

const byTitle = fieldSorter('title');

const competitionTabMapper = (matches = []) => {
  const competitionTabs = [];
  matches.forEach((match) => {
    const { competitionName, tournamentName } = match.navigation.params;
    if (!competitionTabs.some((competition) => (
      competition.competitionName === competitionName
      && competition.tournamentName === tournamentName))) {
      competitionTabs.push(
        { competitionName, tournamentName },
      );
    }
  });

  return (sportName, inPlay = false) => competitionTabs
    .map((competition) => ({
      title: competition.tournamentName || competition.competitionName,
      sportName,
      competitionName: competition.competitionName,
      tournamentName: competition.tournamentName,
      discoveryKey: inPlay
        ? bffCompetitionInPlay : bffCompetitionUpcoming,
      filter: competition.tournamentName
        ? { key: 'tournamentName', value: competition.tournamentName }
        : { key: 'competitionName', value: competition.competitionName },
      refreshRate: 30,
    }));
};

const sportTabsMapper = (sports = [], matches = []) => {
  const sportTabs = [];
  matches.forEach((match) => {
    const { sportName } = match.navigation.params;
    const sportIndex = sports.findIndex((obj) => obj.name === sportName);
    const sportDisplayName = (sportIndex !== -1) ? sports[sportIndex].displayName : null;
    if (!sportTabs.some((sport) => (sport.name === sportName))) {
      sportTabs.push({
        name: sportName,
        displayName: sportDisplayName || sportName,
      });
    }
  });
  return (inPlay = false) => sportTabs
    .map((sport) => ({
      title: sport.displayName,
      sportName: sport.name,
      discoveryKey: inPlay ? bffSportInPlay : bffSportUpcoming,
      filter: { key: 'sportName', value: sport.name },
      refreshRate: 30,
    }));
};

const formatSportUpcomingInPlayChips = (sportName, matches, inPlay) => {
  const { defaultOddsCount, oddsCountBuffer } = config.getDynamicConfig();
  let data = [];
  const matchList = inPlay ? matches : matches.data;
  const competitionTabs = competitionTabMapper(matchList)(sportName, inPlay).sort(byTitle);
  const allCompetitionTile = inPlay ? {
    title: `All ${sportName}`,
    defaultOddsCount,
    oddsCountBuffer,
    sportName,
    data: matches,
    discoveryKey: bffSportInPlay,
    refreshRate: 30,
  } : {
    title: `All ${sportName}`,
    sportName,
    data: [matches],
    discoveryKey: bffSportUpcoming,
    refreshRate: 30,
  };

  if (competitionTabs.length === 1) {
    allCompetitionTile.title = '';
    data.push(allCompetitionTile);
  } else {
    data = competitionTabs;
    data.unshift(allCompetitionTile);
  }
  return data;
};

const formatHomeUpcomingInPlayChips = (sports, matches, inPlay) => {
  const { defaultOddsCount, oddsCountBuffer } = config.getDynamicConfig();
  let data = [];
  const matchList = inPlay ? matches : matches.data;
  const sportTabs = sportTabsMapper(sports, matchList)(inPlay).sort(byTitle);
  const allSportsTile = inPlay ? {
    title: 'All Sports',
    defaultOddsCount,
    oddsCountBuffer,
    data: matches,
    discoveryKey: bffSportsInPlay,
    refreshRate: 30,
  } : {
    title: 'All Sports',
    data: [matches],
    discoveryKey: bffSportsUpcoming,
    refreshRate: 30,
  };
  if (sportTabs.length === 1) {
    allSportsTile.title = '';
    data.push(allSportsTile);
  } else {
    data = sportTabs;
    data.unshift(allSportsTile);
  }
  return data;
};

module.exports = {
  formatHomeUpcomingInPlayChips,
  formatSportUpcomingInPlayChips,
};
