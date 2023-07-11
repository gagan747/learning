const s = require('strummer');

const discoveryKeys = require('./constants/discovery-keys');
const competitionController = require('./controllers/competition');
const homeController = require('./controllers/home');
const matchController = require('./controllers/match');
const offersController = require('./controllers/offers');
const sportController = require('./controllers/sport');
const tournamentController = require('./controllers/tournament');
const tournamentMatchController = require('./controllers/tournament-match');

const JURISDICTIONS = new s.regex(/^(ACT|NSW|NT|QLD|SA|TAS|VIC)$/i);
const PLATFORM = new s.regex(/^(mobile|ios|android|web)$/i);
const OS = new s.regex(/^(mobile|ios|android)$/i);
const BOOLEAN = new s.regex(/^(true|false)$/i);

const query = (...extraParams) => ({
  mandatory: ['jurisdiction'],
  optional: ['homeState', 'platform', 'os', 'version', 'loggedIn', ...extraParams],
});

const validate = ({ ...extraParams } = {}) => ({
  query: new s.objectWithOnly({
    jurisdiction: JURISDICTIONS,
    homeState: new s.optional(JURISDICTIONS),
    platform: new s.optional(PLATFORM),
    os: new s.optional(OS),
    version: new s.optional(new s.string()),
    loggedIn: new s.optional(BOOLEAN),
    ...extraParams,
  }),
});

module.exports = (connectRouter) => {
  const router = connectRouter();

  // Landing page

  router.get({
    path: {
      name: discoveryKeys.bffSportsHome,
      discoveryName: discoveryKeys.bffSportsHome,
      path: '/v1/bff-sports/home',
      query: query('activeTab'),
    },
    validate: validate({
      activeTab: new s.optional(new s.string()),
    }),
    handlers: [homeController.page],
  });

  router.get({
    path: {
      name: discoveryKeys.bffSportsAll,
      discoveryName: discoveryKeys.bffSportsAll,
      path: '/v1/bff-sports/sports/all',
      query: query(),
    },
    validate: validate(),
    handlers: [homeController.sports],
  });

  router.get({
    path: {
      name: discoveryKeys.bffSportsResults,
      discoveryName: discoveryKeys.bffSportsResults,
      path: '/v1/bff-sports/results',
      query: query(),
    },
    validate: validate(),
    handlers: [homeController.results],
  });

  router.get({
    path: {
      name: discoveryKeys.bffSportsUpcoming,
      discoveryName: discoveryKeys.bffSportsUpcoming,
      path: '/v1/bff-sports/upcoming',
      query: query(),
    },
    validate: validate(),
    handlers: [homeController.upcoming],
  });

  router.get({
    path: {
      name: discoveryKeys.bffSportsInPlay,
      discoveryName: discoveryKeys.bffSportsInPlay,
      path: '/v1/bff-sports/in-play',
      query: query(),
    },
    validate: validate(),
    handlers: [homeController.inPlay],
  });

  // Sport page

  router.get({
    path: {
      name: discoveryKeys.bffSport,
      discoveryName: discoveryKeys.bffSport,
      path: '/v1/bff-sports/sports/:sportName/page',
      query: query(),
    },
    validate: validate(),
    handlers: [sportController.page],
  });

  router.get({
    path: {
      name: discoveryKeys.bffSportAll,
      discoveryName: discoveryKeys.bffSportAll,
      path: '/v1/bff-sports/sports/:sportName/all',
      query: query(),
    },
    validate: validate(),
    handlers: [sportController.sport],
  });

  router.get({
    path: {
      name: discoveryKeys.bffSportUpcoming,
      discoveryName: discoveryKeys.bffSportUpcoming,
      path: '/v1/bff-sports/sports/:sportName/upcoming',
      query: query(),
    },
    validate: validate(),
    handlers: [sportController.upcoming],
  });

  router.get({
    path: {
      name: discoveryKeys.bffSportInPlay,
      discoveryName: discoveryKeys.bffSportInPlay,
      path: '/v1/bff-sports/sports/:sportName/in-play',
      query: query(),
    },
    validate: validate(),
    handlers: [sportController.inPlay],
  });

  router.get({
    path: {
      name: discoveryKeys.bffSportResults,
      discoveryName: discoveryKeys.bffSportResults,
      path: '/v1/bff-sports/sports/:sportName/results',
      query: query(),
    },
    validate: validate(),
    handlers: [sportController.results],
  });

  router.get({
    path: {
      name: discoveryKeys.bffSportFeatured,
      discoveryName: discoveryKeys.bffSportFeatured,
      path: '/v1/bff-sports/sports/:sportName/featured',
      query: query(),
    },
    validate: validate(),
    handlers: [sportController.featured],
  });

  router.get({
    path: {
      name: discoveryKeys.bffCompetitionResults,
      discoveryName: discoveryKeys.bffCompetitionResults,
      path: '/v1/bff-sports/sports/:sportName/competitions/:competitionName/results',
      query: query(),
    },
    validate: validate(),
    handlers: [competitionController.results],
  });

  router.get({
    path: {
      name: discoveryKeys.bffTournamentResults,
      discoveryName: discoveryKeys.bffTournamentResults,
      path: '/v1/bff-sports/sports/:sportName/competitions/:competitionName/tournaments/:tournamentName/results',
      query: query(),
    },
    validate: validate(),
    handlers: [tournamentController.results],
  });

  router.get({
    path: {
      name: discoveryKeys.bffCompetitionMatchResults,
      discoveryName: discoveryKeys.bffCompetitionMatchResults,
      path: '/v1/bff-sports/sports/:sportName/competitions/:competitionName/matches/:matchName/results',
      query: query(),
    },
    validate: validate(),
    handlers: [matchController.results],
  });

  router.get({
    path: {
      name: discoveryKeys.bffTournamentMatchResults,
      discoveryName: discoveryKeys.bffTournamentMatchResults,
      path: '/v1/bff-sports/sports/:sportName/competitions/:competitionName/tournaments/:tournamentName/matches/:matchName/results',
      query: query(),
    },
    validate: validate(),
    handlers: [tournamentMatchController.results],
  });

  // Competition page

  router.get({
    path: {
      name: discoveryKeys.bffCompetition,
      discoveryName: discoveryKeys.bffCompetition,
      path: '/v1/bff-sports/sports/:sportName/competitions/:competitionName/page',
      query: query('activeChip'),
    },
    validate: validate({
      activeChip: new s.optional(new s.string()),
    }),
    handlers: [competitionController.page],
  });

  router.get({
    path: {
      name: discoveryKeys.bffTournament,
      discoveryName: discoveryKeys.bffTournament,
      path: '/v1/bff-sports/sports/:sportName/competitions/:competitionName/tournaments/:tournamentName/page',
      query: query('activeChip'),
    },
    validate: validate({
      activeChip: new s.optional(new s.string()),
    }),
    handlers: [tournamentController.page],
  });

  // Match page

  router.get({
    path: {
      name: discoveryKeys.bffCompetitionMatch,
      discoveryName: discoveryKeys.bffCompetitionMatch,
      path: '/v1/bff-sports/sports/:sportName/competitions/:competitionName/matches/:matchName/page',
      query: query('activeTab', 'referrer'),
    },
    validate: validate({
      activeTab: new s.optional(new s.string()),
      referrer: new s.optional(new s.string()),
    }),
    handlers: [matchController.page],
  });

  router.get({
    path: {
      name: discoveryKeys.bffCompetitionMatchMarkets,
      discoveryName: discoveryKeys.bffCompetitionMatchMarkets,
      path: '/v1/bff-sports/sports/:sportName/competitions/:competitionName/matches/:matchName/markets',
      query: query(),
    },
    validate: validate(),
    handlers: [matchController.markets],
  });

  router.get({
    path: {
      name: discoveryKeys.bffCompetitionMatchSGM,
      discoveryName: discoveryKeys.bffCompetitionMatchSGM,
      path: '/v1/bff-sports/sports/:sportName/competitions/:competitionName/matches/:matchName/same-game-multi',
      query: query(),
    },
    validate: validate(),
    handlers: [matchController.sameGameMulti],
  });

  router.get({
    path: {
      name: discoveryKeys.bffTournamentMatch,
      discoveryName: discoveryKeys.bffTournamentMatch,
      path: '/v1/bff-sports/sports/:sportName/competitions/:competitionName/tournaments/:tournamentName/matches/:matchName/page',
      query: query('activeTab', 'referrer'),
    },
    validate: validate({
      activeTab: new s.optional(new s.string()),
      referrer: new s.optional(new s.string()),
    }),
    handlers: [tournamentMatchController.page],
  });

  router.get({
    path: {
      name: discoveryKeys.bffTournamentMatchMarkets,
      discoveryName: discoveryKeys.bffTournamentMatchMarkets,
      path: '/v1/bff-sports/sports/:sportName/competitions/:competitionName/tournaments/:tournamentName/matches/:matchName/markets',
      query: query(),
    },
    validate: validate(),
    handlers: [tournamentMatchController.markets],
  });

  router.get({
    path: {
      name: discoveryKeys.bffTournamentMatchSGM,
      discoveryName: discoveryKeys.bffTournamentMatchSGM,
      path: '/v1/bff-sports/sports/:sportName/competitions/:competitionName/tournaments/:tournamentName/matches/:matchName/same-game-multi',
      query: query(),
    },
    validate: validate(),
    handlers: [tournamentMatchController.sameGameMulti],
  });

  router.get({
    path: {
      name: discoveryKeys.bffOffers,
      discoveryName: discoveryKeys.bffOffers,
      path: '/v1/bff-sports/offers/page',
      query: query('activeTab'),
    },
    validate: validate({
      activeTab: new s.optional(new s.string()),
    }),
    handlers: [offersController.page],
  });

  router.get({
    path: {
      name: discoveryKeys.bffOffer,
      discoveryName: discoveryKeys.bffOffer,
      path: '/v1/bff-sports/offers/:offerName/all',
      query: query(),
    },
    validate: validate(),
    handlers: [offersController.offer],
  });

  return router;
};
