const config = require('../../config');
const { statsServiceBffRanking, statsServiceBffMatchup } = require('../../constants/stats-service-keys');
const { screenStatsRanking, screenStatsMatchup } = require('../../constants/template-keys');
const { compareAppVersion } = require('../../utils');
const { statsFormatter } = require('./nba-stats');

const marketsWithMatchup = ['Line'];
const marketsWithTable = ['Head To Head', 'Result'];
const allowedHeaders = {
  NBA: ['rank', 'clubLogo', 'P', 'W', 'L', 'H', 'A', 'STK'],
  NRL: ['rank', 'clubLogo', 'P', 'PTS', 'W', 'L', 'D', 'DIFF'],
  AFL: ['rank', 'clubLogo', 'P', 'PTS', 'W', 'L', 'D', '%'],
};

const homeAwayCheck = ({ isHome, isAway }, header) => ((isHome && header === 'A') || (isAway && header === 'H'));

const getIntegratedMatchup = ({ data = [] } = {}, params = {}) => {
  const matchup = data.find((d) => d.type === 'sports.stats.matchup');

  if (!matchup || !matchup.data.length) {
    return undefined;
  }

  const teams = matchup.data.find((d) => d.type === 'sports.stats.matchup.teams');

  if (!teams || !teams.data.length) {
    return undefined;
  }

  const h2h = teams.data.find((d) => d.type === 'sports.stats.matchup.teams.h2h');

  if (!h2h || !h2h.data.length) {
    return undefined;
  }

  const match = h2h.data[0].matches[0];
  if (!match) {
    return undefined;
  }

  return {
    type: 'sports.stats.matchup.result',
    data: {
      navigation: {
        discoveryKey: statsServiceBffMatchup,
        template: screenStatsMatchup,
        params,
      },
      result: {
        ...match,
        title: `Last Time: ${match.title}`,
      },
    },
  };
};

const adjustHeadersAndRows = (competition, headers = [], rows = [], title = '') => {
  const headersToKeep = allowedHeaders[competition] || [];
  const orderedHeaders = [];
  const orderedRows = rows.map((r) => ({ ...r, data: [] }));
  headersToKeep.forEach((h) => {
    const headerIndex = headers.findIndex((it) => it.key === h);
    const header = headers[headerIndex];
    orderedHeaders.push({
      ...header,
      key: header.show ? header.key.substring(0, 3) : header.key,
    });
    rows.forEach((row, idx) => {
      if (homeAwayCheck(row, header.key)) {
        orderedRows[idx].data.push({
          ...row.data[headerIndex],
          styling: {
            fontColor: 'lightGray',
          },
        });
      } else {
        orderedRows[idx].data.push(row.data[headerIndex]);
      }
    });
  });

  let tableTitle = 'LADDER';
  if (competition.toUpperCase() === 'NBA') {
    tableTitle = title.substring(0, 4).toUpperCase();
  }
  orderedHeaders[0] = {
    ...orderedHeaders[0],
    show: true,
    key: tableTitle,
  };

  return {
    headers: orderedHeaders,
    rows: orderedRows.filter((r) => r.enableHighlighted),
  };
};

const getIntegratedTable = ({ data = [] } = {}, params = {}) => {
  const table = data.find((d) => d.type === 'sports.stats.table');

  if (!table) {
    return undefined;
  }

  return {
    ...table,
    data: {
      ...table.data,
      navigation: {
        discoveryKey: statsServiceBffRanking,
        template: screenStatsRanking,
        params,
      },
      table: table.data.table.map((tab) => ({
        title: tab.title,
        ...adjustHeadersAndRows(
          params.competitionName,
          tab.headers,
          tab.rows,
          tab.title,
        ),
      })).filter((item) => item.rows.length),
    },
  };
};

const getIntegratedStats = ({ data = [] } = {}) => data.reduce((acc, it) => {
  acc[it.betOptionName] = it;
  return acc;
}, {});

const statsGetter = ({ sportName, competitionName, version }) => {
  const { statsMinAppVersion } = config.getDynamicConfig();

  const useNbaStats = compareAppVersion(version, statsMinAppVersion) < 0;

  return ({ spectrumUniqueId, contestants }) => ({
    statsMatchup,
    statsTable,
    statsIntegrated,
  }) => {
    if (useNbaStats) {
      return (marketName) => statsFormatter({
        params: {
          sportName,
          competitionName,
          spectrumUniqueId,
          marketName,
        },
        stats: {
          matchUpStats: statsMatchup,
          standingsStats: statsTable,
        },
        contestants,
        version,
      });
    }

    const navParams = {
      sportName,
      competitionName,
      spectrumUniqueId,
    };
    const matchup = getIntegratedMatchup(statsMatchup, navParams);
    const table = getIntegratedTable(statsTable, navParams) || { data: {} };
    const integratedStats = getIntegratedStats(statsIntegrated);

    return (marketName) => {
      if (marketsWithMatchup.includes(marketName)) {
        return matchup;
      }

      if (marketsWithTable.includes(marketName) && (table.data.table || []).length) {
        return table;
      }

      const marketIntegrated = integratedStats[marketName];
      if (marketIntegrated) {
        if (marketIntegrated.propositions) {
          return { forProposition: true, ...marketIntegrated };
        }
        return marketIntegrated;
      }

      return undefined;
    };
  };
};

module.exports = {
  statsGetter,
};
