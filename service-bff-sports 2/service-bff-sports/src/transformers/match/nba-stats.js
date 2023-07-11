const config = require('../../config');
const { statsServiceGetStatsStandings } = require('../../constants');
const { abbreviationConfig } = require('../../constants/abbreviation-config');
const { statsDisplayMap } = require('../../constants/market-stats-display-type');
const { compareAppVersion } = require('../../utils');

const homeAwayCheck = ({ isHome, isAway }, header) => ((isHome && header === 'a') || (isAway && header === 'h'));

const getAccessibilityString = (stat) => {
  const sortedData = Object.entries(stat).filter(([key]) => abbreviationConfig[key])
    .sort((a, b) => abbreviationConfig[a[0]].priority - abbreviationConfig[b[0]].priority);
  return sortedData.reduce((acc, [key, value]) => {
    let _string = acc;
    if (abbreviationConfig[key] && abbreviationConfig[key].description
      && !(key === 'a' && stat.isHome) && !(key === 'h' && stat.isAway)) {
      if (key === 'stk') {
        _string = `${_string} ${abbreviationConfig[value.charAt(0)].description.replace('%NUM%', value.charAt(1))}`;
      } else if (key === 'rank' || key === 'teamName') {
        _string = `${_string} ${abbreviationConfig[key].description.replace('%RANK%', value).replace('%TEAMNAME%', value)}`;
      } else {
        _string = `${_string} ${abbreviationConfig[key].description} ${value}`;
      }
    }
    return _string;
  }, '');
};

const getProcessedStats = ({
  stat: { title = '', data = [] },
  allowedHeaders = [],
}) => {
  const headers = [];
  const rows = [];

  const showHomeAwayHeader = data.length !== 1;

  if (title) {
    headers.push({
      key: title.substring(0, 4),
      show: abbreviationConfig.title.showHeader,
      styling: abbreviationConfig.title.headerStyling,
    });
  }

  allowedHeaders.forEach((header) => {
    if (showHomeAwayHeader || (!showHomeAwayHeader && !homeAwayCheck(data[0], header))) {
      headers.push({
        key: header,
        show: abbreviationConfig[header].showHeader,
        styling: abbreviationConfig[header].headerStyling,
      });
    }
  });

  data.forEach((row, i) => {
    rows[i] = {
      accessibilityString: title.substring(0, 4),
      data: [{
        v: row.rank && row.rank.toString(),
        vType: abbreviationConfig.rank.vtype,
        styling: abbreviationConfig.rank.rowStyling,
      }],
    };
    rows[i].accessibilityString += getAccessibilityString(row);

    allowedHeaders.forEach((header) => {
      if (showHomeAwayHeader) {
        let exceptionStyling;
        if (homeAwayCheck(row, header)) {
          exceptionStyling = { fontColor: 'lightGray' };
        }
        rows[i].data.push({
          v: row[header],
          vType: abbreviationConfig[header].vType || typeof row[header],
          styling: header === 'stk'
            ? abbreviationConfig[row[header].charAt(0)].rowStyling
            : exceptionStyling || abbreviationConfig[header].rowStyling,
        });
      } else if (!homeAwayCheck(row, header)) {
        rows[i].data.push({
          v: row[header],
          vType: abbreviationConfig[header].vType || typeof row[header],
          styling: header === 'stk'
            ? abbreviationConfig[row[header].charAt(0)].rowStyling
            : abbreviationConfig[header].rowStyling,
        });
      }
    });
  });
  return { headers, rows };
};

const getStandingsStatsInfo = ({
  standingsStats,
  statsTypeData: { headers: allowedHeaders = [] },
  contestants = [],
  params: { competitionName, sportName, spectrumUniqueId },
  type,
}) => {
  let statsData;
  if (standingsStats && !standingsStats.error) {
    let unsortedStats = [];
    standingsStats.data.forEach((item) => {
      const participants = item.data.filter((_item) => _item.enableHighlighter)
        .map((statsInfo) => {
          const teamName = (contestants.find((x) => x.isHome === statsInfo.isHome) || {}).name || '';
          return { teamName, ...statsInfo, title: item.title };
        });
      unsortedStats = [...unsortedStats, ...participants];
    });

    const sortedStats = unsortedStats.sort((a, b) => {
      const isSameConfTeams = unsortedStats.filter((i) => i.title === a.title).length > 1;
      const homeTeamSort = Number(b.isHome) - Number(a.isHome);
      const rankSort = a.rank - b.rank;
      return isSameConfTeams ? rankSort : homeTeamSort;
    })
      .reduce((acc, curr) => {
        const prev = acc.find((i) => i.title === curr.title);
        if (prev) {
          prev.data.push(curr);
        } else {
          acc.push({
            title: curr.title,
            data: [curr],
          });
        }
        return acc;
      }, []);

    const formattedStats = sortedStats.map((stat) => {
      const processedStats = getProcessedStats({
        stat, allowedHeaders,
      });
      return processedStats;
    });
    if (formattedStats && formattedStats.length) {
      statsData = {
        type,
        data: {
          showHideText: 'mini standings',
          navigation: {
            discoveryKey: statsServiceGetStatsStandings,
            params: {
              competitionName,
              sportName,
              spectrumUniqueId,
            },
          },
          data: formattedStats,
        },
      };
    }
  }
  return statsData;
};

const formattedMatchupStats = (stats) => {
  if (!stats || stats.error) return undefined;
  const teamType = 'app.statsCenter.matchup.teams';
  const teamH2hType = 'app.statsCenter.matchup.teams.h2h.matches';
  const teamsData = (stats.data || []).find((item) => item.type === teamType);
  const teamsH2hData = ((teamsData && teamsData.data) || [])
    .find((item) => item.type === teamH2hType);
  ((teamsH2hData && teamsH2hData.data) || [])
    .sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate));
  const {
    week, matchDate, venue, homeTeamScore, awayTeamScore, homeTeamLogo, awayTeamLogo,
  } = teamsH2hData ? teamsH2hData.data[0] : {};
  return {
    week,
    matchDate,
    venue,
    homeTeamScore,
    awayTeamScore,
    homeTeamLogo,
    awayTeamLogo,
  };
};

const formattedMatchUpStatsWithType = (stats, type) => (formattedMatchupStats(stats) && {
  type,
  data: {
    showHideText: 'Last Time They Met',
    data: formattedMatchupStats(stats),
  },
});

const getMatchupStatsInfo = (stats, type, version) => {
  const { nbaStats: { matchupStatsOldVersion } } = config.getDynamicConfig();

  return compareAppVersion(version, matchupStatsOldVersion) > 0
    ? formattedMatchUpStatsWithType(stats, type)
    : formattedMatchupStats(stats);
};

const isIntegratedStatsEnabled = (marketName, competitionName) => {
  const competition = competitionName.toUpperCase();
  const { nbaStats: { allowedMarketStats = {} } } = config.getDynamicConfig();
  return (allowedMarketStats[competition] || []).includes(marketName);
};

const statsFormatter = (
  {
    params,
    stats: { matchUpStats, standingsStats },
    contestants,
    version,
  },
) => {
  let statsInfo;
  const { marketName, competitionName } = params;
  if (!isIntegratedStatsEnabled(marketName, competitionName)) return statsInfo;
  const [type, statsTypeData] = statsDisplayMap(marketName) || [];
  switch (type) {
    case 'sports.stats.default.matchup':
      statsInfo = getMatchupStatsInfo(matchUpStats, type, version);
      break;
    case 'sports.stats.default.table':
      statsInfo = getStandingsStatsInfo({
        standingsStats, contestants, statsTypeData, params, type,
      });
      break;
    default:
      statsInfo = undefined;
      break;
  }
  return statsInfo;
};

module.exports = {
  statsFormatter,
};
