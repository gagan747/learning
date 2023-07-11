const config = require('../../config');
const {
  statsServiceBffMatchup,
  statsServiceBffRanking,
  statsServiceGetStatsMatchup,
  statsServiceGetStatsStandings,
  statsServiceGetIntegrated,
} = require('../../constants/stats-service-keys');
const log = require('../../log');
const requestCache = require('../../request-cache');
const { compareAppVersion, canShowStats } = require('../../utils');

const fetchNbaStats = async (urlParams) => {
  try {
    return await Promise.all(
      [
        requestCache.fetchStats(statsServiceGetStatsMatchup, urlParams),
        requestCache.fetchStats(statsServiceGetStatsStandings, urlParams),
      ],
    );
  } catch (err) {
    log.error(err, `Unable to fetch match stats for ${urlParams.spectrumUniqueId}`);
  }

  return [];
};

const fetchStats = async (urlParams, showPlayerStats = true) => {
  try {
    return await Promise.all(
      [
        requestCache.fetchStats(statsServiceBffMatchup, urlParams),
        requestCache.fetchStats(statsServiceBffRanking, urlParams),
        showPlayerStats
          ? requestCache.fetchStats(statsServiceGetIntegrated, { ...urlParams, entity: 'players' })
          : undefined,
      ],
    );
  } catch (err) {
    log.error(err, `Unable to fetch match stats for ${urlParams.spectrumUniqueId}`);
  }

  return [];
};

const nbaStatsChecker = ({ competitionName, version }) => {
  const {
    nbaStatsMinAppVersion,
    nbaStats: {
      allowStatsCenterForCompetition = [],
    },
  } = config.getDynamicConfig();

  const isValid = allowStatsCenterForCompetition.includes(competitionName.toUpperCase())
    && compareAppVersion(version, nbaStatsMinAppVersion) >= 0;

  return ({ stats, inPlay }) => isValid && stats && !inPlay;
};

const showStatsCentreForComp = (compName) => {
  const { hideStatsCentre } = config.getDynamicConfig().toggles;

  if (hideStatsCentre && Array.isArray(hideStatsCentre) && hideStatsCentre.includes(compName)) {
    return false;
  }
  return true;
};

const showIntegrStatsForComp = (compName) => {
  const { hideIntegratedStats: hideIntegrStats } = config.getDynamicConfig().toggles;

  if (hideIntegrStats && Array.isArray(hideIntegrStats) && hideIntegrStats.includes(compName)) {
    return false;
  }
  return true;
};

const showPlayerIntegrStatsForComp = (compName) => {
  const { hidePlayerIntegratedStats } = config.getDynamicConfig().toggles;

  return !(
    hidePlayerIntegratedStats
    && Array.isArray(hidePlayerIntegratedStats)
    && hidePlayerIntegratedStats.includes(compName)
  );
};

const statsChecker = (version) => {
  const { statsMinAppVersion } = config.getDynamicConfig();

  const isValid = compareAppVersion(version, statsMinAppVersion) >= 0;
  return ({ stats, inPlay }) => isValid && stats && !inPlay;
};

const statsCentreChecker = ({ competitionName, version }) => {
  const showStatsCentre = showStatsCentreForComp(competitionName);
  const checkStats = statsChecker(version);
  const checkNbaStats = nbaStatsChecker({ competitionName, version });

  return (match) => showStatsCentre && (checkStats(match) || checkNbaStats(match));
};

const statsFetcher = ({ sportName, competitionName, version }) => {
  const checkStats = statsChecker(version);
  const checkNbaStats = nbaStatsChecker({ competitionName, version });

  return async ({ spectrumUniqueId, stats, inPlay }) => {
    const matchData = { stats, inPlay };
    const urlParams = { sportName, competitionName, spectrumUniqueId };
    const showIntegrStats = showIntegrStatsForComp(competitionName);
    const showPlayerStats = showPlayerIntegrStatsForComp(competitionName);

    if (showIntegrStats) {
      if (checkStats(matchData)) {
        return fetchStats(urlParams, showPlayerStats);
      }

      if (checkNbaStats(matchData)) {
        return fetchNbaStats(urlParams);
      }
    }

    return [];
  };
};

const getStatsUiToggle = (competitionName, version, hasPlayerStats = false) => {
  const { statsMinAppVersion } = config.getDynamicConfig();

  if (compareAppVersion(version, statsMinAppVersion) < 0) {
    return undefined;
  }

  return {
    type: 'sports.match.stats.toggle',
    isDefaultEnabled: true,
    showNewTag: canShowStats(competitionName, version, 'insights'),
    showPlayerOnboarding: hasPlayerStats,
  };
};

module.exports = {
  getStatsUiToggle,
  statsCentreChecker,
  statsFetcher,
  showStatsCentreForComp,
  showIntegrStatsForComp,
};
