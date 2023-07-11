const launchDarkly = require('launchdarkly-node-server-sdk');

const config = require('./config');
const { compVersions } = require('./utils/string');

let ldClient;

let featureFlags = {};
const {
  trendingBetsEnabledKey,
  trendingBetsMinAppVersionKey,
  trendingSGMGroupDisplayIndexKey,
  sgmPokeEnabledKey,
  psgmTweakEnabledKey,
} = config.get().launchDarkly;
const keys = [
  trendingBetsEnabledKey,
  trendingBetsMinAppVersionKey,
  trendingSGMGroupDisplayIndexKey,
  sgmPokeEnabledKey,
  psgmTweakEnabledKey,
];
const jurisdictions = ['VIC', 'NSW', 'ACT', 'WA', 'QLD', 'SA', 'TAS', 'NT'];

const user = {
  key: 'annoymous',
  custom: {
    groups: 'api',
  },
};

// For testing only
const _getStore = () => featureFlags;
const _setStore = (storeValue) => {
  featureFlags = storeValue;
};
const _getLdClient = () => ldClient;
const _setLdClient = (ldClientToBeSet) => {
  ldClient = ldClientToBeSet;
};

const setFeatureFlag = (key) => {
  if (!featureFlags[key]) {
    featureFlags[key] = {};
    if ([trendingBetsEnabledKey, sgmPokeEnabledKey, psgmTweakEnabledKey].includes(key)) {
      jurisdictions.forEach((jurisdiction) => {
        user.key = jurisdiction;
        ldClient.variation(key, user, false, (_err, showFeature) => {
          featureFlags[key][jurisdiction] = showFeature;
        });
      });
    } else {
      ldClient.variation(key, user, false, (_err, featureFlagValue) => {
        featureFlags[key] = featureFlagValue;
      });
    }
  }
};

const initFeatureFlag = (key) => {
  setFeatureFlag(key);

  ldClient.on(`update:${key}`, () => {
    featureFlags[key] = undefined;
    setFeatureFlag(key);
  });
};

const run = () => {
  ldClient = launchDarkly.init(config.get().launchDarkly.initKey);

  ldClient.once('ready', () => {
    keys.forEach(initFeatureFlag);
  });
};

// eslint-disable-next-line max-len
const isTrendingSGMBetsEnabled = (jurisdiction, appVersion) => !!featureFlags[trendingBetsEnabledKey] && !!featureFlags[trendingBetsEnabledKey][jurisdiction]
  && compVersions(featureFlags[trendingBetsMinAppVersionKey], appVersion || '');

const isSgmPokeEnabled = (jurisdiction) => !!featureFlags[sgmPokeEnabledKey]
 && !!featureFlags[sgmPokeEnabledKey][jurisdiction];

const isPsgmTweakEnabled = (jurisdiction) => !!featureFlags[psgmTweakEnabledKey]
 && !!featureFlags[psgmTweakEnabledKey][jurisdiction];

// This needs to be zero based index
// where 0 means first
const getTrendingSGMGroupDisplayIndex = () => (featureFlags[trendingSGMGroupDisplayIndexKey]
  ? +featureFlags[trendingSGMGroupDisplayIndexKey]
  : 0);

module.exports = {
  run,
  isTrendingSGMBetsEnabled,
  _getStore,
  _setStore,
  _getLdClient,
  _setLdClient,
  getTrendingSGMGroupDisplayIndex,
  isSgmPokeEnabled,
  isPsgmTweakEnabled,
};
