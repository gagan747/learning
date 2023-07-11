const config = require('../../config');
const {
  infoCompetitionMatch,
  infoCompetitionMatches,
  infoTournamentMatch,
  infoTournamentMatches,
} = require('../../constants/info-keys');
const launchDarkly = require('../../launch-darkly');
const requestCache = require('../../request-cache');
const {
  getAllMarkets,
  getSgmMarkets,
  matchCarouselGetter,
  matchHeaderGetter,
  matchListGetter,
  matchTabsGetter,
} = require('../../transformers');
const { getPromoBanner, fetchPromotions } = require('../promotions');
const { getMedia } = require('./media');
const {
  statsFetcher, getStatsUiToggle, statsCentreChecker, showIntegrStatsForComp,
} = require('./stats');
const { fetchTrendingSGMBets } = require('./trending-sgm-bets');

const fetchMatches = async (urlParams) => {
  const key = urlParams.tournamentName ? infoTournamentMatches : infoCompetitionMatches;

  return requestCache.fetchInfo(key, urlParams);
};

const fetchMatch = async (urlParams) => {
  const key = urlParams.tournamentName ? infoTournamentMatch : infoCompetitionMatch;

  return requestCache.fetchInfo(key, urlParams);
};

const isTrendingSGMBetsEnabled = (jurisdiction, appVersion) => launchDarkly
  .isTrendingSGMBetsEnabled(jurisdiction.toUpperCase(), appVersion);

const shouldFetchTrendingSGMBets = (jurisdiction, appVersion, { sameGame, inPlay }) => sameGame
  && !inPlay && isTrendingSGMBetsEnabled(jurisdiction, appVersion);

const getMatchPage = async ({
  sportName,
  competitionName,
  tournamentName,
  matchName,
  jurisdiction,
  homeState,
  activeTab,
  referrer,
  platform,
  version,
  loggedIn = '',
}) => {
  const {
    matchCarouselChannels,
    toggles: { enableMatchCarousel },
  } = config.getDynamicConfig();

  const [matches, match, promotions] = await Promise.all([
    fetchMatches({
      sportName,
      competitionName,
      tournamentName,
      jurisdiction,
      homeState,
    }),
    fetchMatch({
      sportName,
      competitionName,
      tournamentName,
      matchName,
      jurisdiction,
      homeState,
    }),
    fetchPromotions({
      jurisdiction,
      platform,
      homeState,
      loggedIn,
    }),
  ]);

  const [
    statsMatchup,
    statsTable,
    statsIntegrated,
  ] = await statsFetcher({
    sportName,
    competitionName,
    version,
  })(match);

  const hasStatsCentre = statsCentreChecker({ competitionName, version })(match);
  const hasIntegrStats = showIntegrStatsForComp(competitionName);

  const statsToggle = (statsMatchup || statsTable || statsIntegrated)
    && hasIntegrStats
    && getStatsUiToggle(competitionName, version, Boolean(statsIntegrated));

  const matchMedia = await getMedia(
    referrer,
    competitionName,
    match,
    jurisdiction,
    hasStatsCentre,
  );

  const trendingSGMBets = shouldFetchTrendingSGMBets(jurisdiction, version, match)
    ? await fetchTrendingSGMBets({
      sportName,
      matchId: match.id,
      eventDate: match.startTime,
    })
    : undefined;

  const matchCarousel = enableMatchCarousel && matchCarouselChannels.includes(competitionName)
    && matchMedia && matchMedia.media && matchMedia.media.autoPlay
    ? matchCarouselGetter({
      sportName,
      competitionName,
      tournamentName,
      matchName,
    })(matches)
    : undefined;

  const matchList = matchListGetter({
    sportName,
    competitionName,
    tournamentName,
    matchName,
  })(matches, promotions, {
    sportName,
    competitionName: tournamentName || competitionName,
  });

  const matchHeader = matchHeaderGetter({
    sportName,
    competitionName,
    tournamentName,
  })(match);

  const matchTabs = matchTabsGetter({
    sportName,
    competitionName,
    tournamentName,
    jurisdiction,
    version,
    activeTab,
  })({
    promotions,
    trendingSGMBets,
    statsMatchup,
    statsTable,
    hasStatsCentre,
    statsIntegrated,
  })(match);

  const promoBanner = await getPromoBanner({
    jurisdiction,
    homeState,
    sportName,
    competitionName,
    tournamentName,
    matchId: match.id,
    loggedIn,
    matchStartTime: match.startTime,
  });

  return {
    type: 'sports.sport.match',
    data: [
      matchList,
      promoBanner,
      matchHeader,
      matchMedia && matchMedia.media,
      matchMedia && matchMedia.buttons,
      statsToggle,
      matchCarousel && matchCarousel.matches.length && matchCarousel,
      matchTabs,
    ].filter(Boolean),
  };
};

const getMatchMarkets = async ({
  sportName,
  competitionName,
  tournamentName,
  matchName,
  jurisdiction,
  homeState,
  platform,
  version,
  loggedIn,
}) => {
  const [match, promotions] = await Promise.all([
    fetchMatch({
      sportName,
      competitionName,
      tournamentName,
      matchName,
      jurisdiction,
      homeState,
    }),
    fetchPromotions({
      jurisdiction,
      platform,
      homeState,
      loggedIn,
    }),
  ]);

  const [
    statsMatchup,
    statsTable,
    statsIntegrated,
  ] = await statsFetcher({
    sportName,
    competitionName,
    version,
  })(match);

  const trendingSGMBets = shouldFetchTrendingSGMBets(jurisdiction, version, match)
    ? await fetchTrendingSGMBets({
      sportName,
      matchId: match.id,
      eventDate: match.startTime,
    })
    : undefined;

  const additionalData = {
    promotions,
    trendingSGMBets,
    statsMatchup,
    statsTable,
    statsIntegrated,
    sportName,
    competitionName,
    tournamentName,
    version,
    jurisdiction,
  };

  return getAllMarkets(match, additionalData);
};

const getMatchSameGameMulti = async ({
  sportName,
  competitionName,
  tournamentName,
  matchName,
  jurisdiction,
  homeState,
  platform,
  version,
  loggedIn,
}) => {
  const [match, promotions] = await Promise.all([
    fetchMatch({
      sportName,
      competitionName,
      tournamentName,
      matchName,
      jurisdiction,
      homeState,
    }),
    fetchPromotions({
      jurisdiction,
      platform,
      homeState,
      loggedIn,
    }),
  ]);

  const [
    statsMatchup,
    statsTable,
    statsIntegrated,
  ] = await statsFetcher({
    sportName,
    competitionName,
    version,
  })(match);

  const trendingSGMBets = shouldFetchTrendingSGMBets(jurisdiction, version, match)
    ? await fetchTrendingSGMBets({
      sportName,
      matchId: match.id,
      eventDate: match.startTime,
    })
    : undefined;

  const additionalData = {
    promotions,
    trendingSGMBets,
    version,
    statsMatchup,
    statsTable,
    statsIntegrated,
    sportName,
    competitionName,
    tournamentName,
    jurisdiction,
  };

  return getSgmMarkets(match, additionalData);
};

module.exports = {
  getMatchPage,
  getMatchMarkets,
  getMatchSameGameMulti,
};
