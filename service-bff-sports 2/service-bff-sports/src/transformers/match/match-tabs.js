const config = require('../../config');
const {
  bffTournamentMatchMarkets,
  bffCompetitionMatchMarkets,
  bffTournamentMatchSGM,
  bffCompetitionMatchSGM,
  statsServiceGetStatsLineup,
  screenStatsLineups,
} = require('../../constants');
const launchDarkly = require('../../launch-darkly');
const { canShowStats } = require('../../utils');
const { getAllMarkets, getSgmMarkets } = require('./match-markets');

const getDisclaimer = (statsMatchup, statsTable) => {
  const disclaimer = ((statsMatchup.data || statsTable.data) || []).find((it) => (
    it.type === 'sports.stats.disclaimer'
  ));
  if (!disclaimer) {
    return undefined;
  }

  return {
    type: disclaimer.type,
    text: [(disclaimer.data || {}).text || ''],
  };
};

const matchTabsGetter = ({
  sportName,
  competitionName,
  tournamentName,
  jurisdiction,
  version,
  activeTab = 'all',
}) => {
  const {
    toggles: {
      enableSGM,
      enableSGMforAllMarkets,
    },
  } = config.getDynamicConfig();

  const enableSgmPoke = launchDarkly.isSgmPokeEnabled(jurisdiction.toUpperCase());

  return ({
    promotions,
    trendingSGMBets,
    statsMatchup,
    statsTable,
    hasStatsCentre,
    statsIntegrated,
  }) => (match) => {
    const sgmMarkets = enableSGM
      ? getSgmMarkets(match, {
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
      })
      : { data: [] };

    const allMarkets = getAllMarkets(
      match,
      {
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
        showSameGameInfo: enableSGMforAllMarkets && !!sgmMarkets.data.length,
      },
    );

    const hasIntegratedStats = Boolean(
      (statsTable || {}).type
      || (statsMatchup || {}).type,
    ) && canShowStats(competitionName, version, 'insights');

    return {
      type: 'sports.match.tabs',
      data: [
        {
          title: 'All Markets',
          tab: 'all',
          active: activeTab === 'all',
          enableSgmPoke,
          discoveryKey: tournamentName ? bffTournamentMatchMarkets : bffCompetitionMatchMarkets,
          data: [
            allMarkets,
            ...(hasIntegratedStats
              ? [getDisclaimer(statsMatchup, statsTable)]
              : []),
          ].filter(Boolean),
        },
        ...(
          sgmMarkets.data.length
            ? [{
              title: 'Same Game Multi',
              icon: {
                appIconIdentifier: 'sgm',
              },
              tab: 'sgm',
              active: activeTab === 'sgm',
              discoveryKey: tournamentName ? bffTournamentMatchSGM : bffCompetitionMatchSGM,
              data: [
                sgmMarkets,
                ...(hasIntegratedStats
                  ? [getDisclaimer(statsMatchup, statsTable)]
                  : []),
              ].filter(Boolean),
            }]
            : []
        ),
        ...(
          hasStatsCentre
            ? [{
              title: 'Stats',
              tab: 'stats',
              active: activeTab === 'stats',
              discoveryKey: statsServiceGetStatsLineup,
              navigation: {
                discoveryKey: statsServiceGetStatsLineup,
                template: screenStatsLineups,
                params: {
                  sportName,
                  competitionName,
                  tournamentName,
                  matchName: match.name,
                  spectrumUniqueId: match.spectrumUniqueId,
                },
              },
              showNewTag: canShowStats(competitionName, version),
            }]
            : []
        ),
      ],
    };
  };
};

module.exports = {
  matchTabsGetter,
};
