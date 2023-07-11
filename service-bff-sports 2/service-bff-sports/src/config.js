const s = require('strummer');

const { ApiClient, ApiAuthentication } = require('@tabdigital/api-client');
const DynamicConfig = require('@tabdigital/dynamic-config');
const jconfig = require('@tabdigital/json-config');

const pkg = require('../package.json');
const log = require('./log');

let config = null;
let dynamicConfig = null;
let client = null;

const dynamicConfigSchema = new s.object({
  racingSports: new s.array({ of: new s.string() }),
  todaysOffers: new s.string(),
  featureLimit: new s.number(),
  defaultOddsCount: new s.number(),
  oddsCountBuffer: new s.number(),
  promoBannerTimer: new s.number(),
  toggles: new s.object({
    enableQuicklinkCarousel: new s.boolean(),
    enableHomeInplay: new s.boolean(),
    enableHomeResults: new s.boolean(),
    enableSportUpcoming: new s.boolean(),
    enableSportInplay: new s.boolean(),
    enableSportFeatured: new s.boolean(),
    enableSGM: new s.boolean(),
    useInfoNextToGo: new s.boolean(),
    enableExpiresHeader: new s.boolean(),
    enableMatchCarousel: new s.boolean(),
    hideVisionPreview: new s.boolean(),
    showTournamentPromo: new s.boolean(),
    enableSGMforAllMarkets: new s.boolean(),
    hideIntegratedStats: new s.array({ optional: true, of: new s.string() }),
    hidePlayerIntegratedStats: new s.array({ optional: true, of: new s.string() }),
    hideStatsCentre: new s.array({ optional: true, of: new s.string() }),
    enableMarketsInUpcomingMatches: new s.boolean(),
  }),
  hideVisionProviders: new s.array({ of: new s.string() }),
  displayBetTypes: new s.array({ of: new s.string() }),
  cacheDuration: new s.object({
    defaultTtl: new s.string(),
  }),
  expiresHeader: new s.object({
    defaultMaxAge: new s.string(),
    routeOverrides: new s.object({}),
  }),
  matchCarouselChannels: new s.array({ of: new s.string() }),
  defaultMatchCarouselImages: new s.object({
    NFL: new s.array({ of: new s.string() }),
    NBA: new s.array({ of: new s.string() }),
    'Major League Baseball': new s.array({ of: new s.string() }),
  }),
  offers: new s.object({
    sportId: new s.string(),
    retailSportId: new s.string(),
    comments: new s.string(),
    jurisdictionOverrides: new s.array({ of: new s.string() }),
    competitionsWithInVenueOnly: new s.object({}),
  }),
  nbaStatsMinAppVersion: new s.string(),
  statsMinAppVersion: new s.string(),
  betOptionsCarousel: new s.object({}),
  marketPropsMapping: new s.object({}),
  betTypeFiltersMinAppVersion: new s.string(),
  dateGroupsMinAppVersion: new s.string(),
  showStats: new s.optional(s.object({})),
  nbaStats: new s.object({
    matchupStatsOldVersion: new s.string(),
    allowedMarketStats: new s.object({}),
    showStatsNewTag: new s.object({}),
    allowStatsCenterForCompetition: new s.array({ of: new s.string() }),
  }),
  sgmVulnerableBetGroups: new s.array({ of: new s.string() }),
});

const getApiClient = () => {
  if (!client) {
    client = new ApiClient({
      authentication:
        config.identityService.enabled !== true
          ? null
          : new ApiAuthentication(config.identityService.url, {
            clientId: config.identityService.clientId,
            clientSecret: config.identityService.clientSecret,
            grantType: 'client_credentials',
          }),
      defaultRequestOpts: {
        forever: true,
      },
    });
  }
  return client;
};

const loadConfig = () => {
  config = jconfig.load({
    schema: new s.objectWithOnly({
      serverPort: new s.number(),
      publicUrl: new s.url(),
      basePath: new s.string(),

      identityService: new s.objectWithOnly({
        enabled: new s.boolean(),
        url: new s.url(),
        clientId: new s.string(),
        clientSecret: new s.string(),
      }),

      discoveryService: new s.objectWithOnly({
        url: new s.url(),
        refreshInterval: new s.string(),
      }),

      infoService: new s.objectWithOnly({
        url: new s.url(),
        cacheDuration: new s.number(),
      }),

      recommendationService: new s.objectWithOnly({
        url: new s.url(),
        cacheDuration: new s.number(),
      }),

      contentHubService: new s.objectWithOnly({
        url: new s.url(),
        cacheDuration: new s.number(),
      }),

      statsService: new s.objectWithOnly({
        url: new s.url(),
        cacheDuration: new s.number(),
      }),

      sportsVisionChannels: new s.object(),

      aem: new s.objectWithOnly({
        baseUrl: new s.string(),
        sport: new s.objectWithOnly({
          path: new s.string(),
          cacheDuration: new s.number(),
        }),
        promo: new s.objectWithOnly({
          path: new s.string(),
          cacheDuration: new s.number(),
        }),
      }),

      trendingBetsService: new s.objectWithOnly({
        url: new s.url(),
      }),

      launchDarkly: new s.objectWithOnly({
        initKey: new s.string(),
        trendingBetsEnabledKey: new s.string(),
        trendingBetsMinAppVersionKey: new s.string(),
        trendingSGMGroupDisplayIndexKey: new s.string(),
        sgmPokeEnabledKey: new s.string(),
        psgmTweakEnabledKey: new s.string(),
      }),

      dynamicConfigService: new s.objectWithOnly({
        enabled: new s.boolean(),
        url: new s.url(),
        refreshInterval: new s.duration(),
      }),

      dynamicConfig: dynamicConfigSchema,
    }),
  });
  dynamicConfig = new DynamicConfig(dynamicConfigSchema, config.dynamicConfig);
};

exports.fetchDynamicConfig = async () => {
  const { _links, ...data } = await getApiClient().get(config.dynamicConfigService.url, {
    urlParams: { applicationName: pkg.name },
  });
  const changes = dynamicConfig.update(data);
  if (!changes) {
    log.info({ dynamicConfigChanges: changes });
  }
};

exports.setDynamicConfig = (newData) => dynamicConfig.set(newData);
exports.getDynamicConfig = () => dynamicConfig.get();

module.exports.get = () => {
  if (config === null) {
    loadConfig();
  }
  return config;
};
