const config = require('../config');
const { compareAppVersion } = require('./string');

const canShowStats = (competition, version, type = 'newTag') => {
  const { showStats } = config.getDynamicConfig();
  const tagConfig = showStats[competition.toUpperCase()];
  if (!tagConfig) {
    return false;
  }

  return (
    tagConfig[type]
    && compareAppVersion(version, tagConfig.startVersion) >= 0
    && compareAppVersion(version, tagConfig.endVersion) <= 0
  );
};

module.exports = { canShowStats };
