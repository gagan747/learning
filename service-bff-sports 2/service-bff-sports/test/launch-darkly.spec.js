const sinon = require('sinon');

const launchDarkly = require(`${global.SRC}/launch-darkly`);
const config = require(`${global.SRC}/config`);

describe('LaunchDarkly', () => {
  describe('isTrendingSGMBetsEnabled', () => {
    beforeEach(() => {
      launchDarkly._setStore({
        [config.get().launchDarkly.trendingBetsEnabledKey]: {
          NSW: true,
        },
        [config.get().launchDarkly.trendingBetsMinAppVersionKey]: '12.2.1',
      });
    });
    it('returns true if feature is enabled for jurisdiction and same app version', () => {
      const result = launchDarkly.isTrendingSGMBetsEnabled('NSW', '12.2.1');
      result.should.equal(true);
    });

    it('returns false if feature is enabled for jurisdiction and app version is smaller', () => {
      const result = launchDarkly.isTrendingSGMBetsEnabled('NSW', '12.2.0');
      result.should.equal(false);
    });

    it('returns true if feature is enabled for jurisdiction and app version is greater', () => {
      const result = launchDarkly.isTrendingSGMBetsEnabled('NSW', '12.2.2');
      result.should.equal(true);
    });

    it('returns false if feature is enabled for jurisdiction', () => {
      const result = launchDarkly.isTrendingSGMBetsEnabled('QLD');
      result.should.equal(false);
    });
  });

  describe('run', () => {
    it('should set values in store', () => {
      const ldClient = {
        // eslint-disable-next-line new-cap
        variration: () => new Promise.resolve({
          [config.get().launchDarkly.trendingBetsEnabledKey]: {
            NSW: true,
          },
        }),
      };
      sinon.stub(ldClient, 'variration');
      launchDarkly._setLdClient(ldClient);
      launchDarkly.run();
      const featureStore = launchDarkly._getStore();
      featureStore.should.eql({
        'bff-sports-trending-bets-enabled': undefined,
        [config.get().launchDarkly.trendingBetsEnabledKey]: {
          NSW: true,
        },
        [config.get().launchDarkly.trendingBetsMinAppVersionKey]: '12.2.1',
      });
    });
  });
});
