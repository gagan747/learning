const config = require('../config');

const fetchVisionFlags = ({ skySports, vision } = {}) => {
  const {
    toggles: { hideVisionPreview },
    hideVisionProviders = [],
  } = config.getDynamicConfig();

  let hasVision = false;
  const hasPreview = !!(skySports && !hideVisionPreview);
  if (vision) {
    const provider = Object.keys(vision)[0] || '';
    hasVision = !hideVisionProviders.includes(provider.toLowerCase());
  }

  return {
    hasPreview,
    hasVision,
  };
};

module.exports = {
  fetchVisionFlags,
};
