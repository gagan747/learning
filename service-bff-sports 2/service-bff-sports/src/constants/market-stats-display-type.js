const statsDisplayMap = (market = '') => {
  const statsType = {
    'sports.stats.default.matchup': {
      markets: ['Line'],
    },
    'sports.stats.default.table': {
      markets: ['Head To Head', 'Result'],
      headers: ['clubLogo', 'p', 'w', 'l', 'h', 'a', 'stk'],
    },
  };
  return Object.entries(statsType).find(([, { markets }]) => markets.includes(market));
};

// type can belong to multiple market, it can be an array
module.exports = { statsDisplayMap };
