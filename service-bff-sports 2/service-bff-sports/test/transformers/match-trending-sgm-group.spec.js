const sinon = require('sinon');

const trendingSgmGroupTransformer = require(`${global.SRC}/transformers/match/match-trending-sgm-group.js`);

const config = require(`${global.SRC}/config`);

const aflMatch = require('../mocks/info-wift/matches/adelaide-v-fremantle.json');
const nrlMatch = require('../mocks/info-wift/matches/nthqld-v-dolphins.json');
const nbaMatch = require('../mocks/info-wift/matches/utah-v-oklahoma-city.json');

describe('transformers - match trending sgm group', () => {
  const { dynamicConfig } = config.get();

  const nbaPsgms = [
    {
      propositions: [578528, 578549], // Same player - points - filter out
      numPunters: 4,
      odds: 6.5,
    },
    {
      propositions: [578528, 578551], // Different Players - points
      numPunters: 3,
      odds: 201.0,
    },
    {
      propositions: [578720, 578737], // Same player - rebounds - filter out
      numPunters: 6,
      odds: 72,
    },
    {
      propositions: [578720, 578736], // Different Players - rebounds
      numPunters: 6,
      odds: 72,
    },
    {
      propositions: [578648, 578664], // Same player - assists - filter out
      numPunters: 6,
      odds: 72,
    },
    {
      propositions: [578648, 578663], // Different Players - assists
      numPunters: 6,
      odds: 72,
    },
    {
      propositions: [578859, 578870], // Same player - pra - filter out
      numPunters: 6,
      odds: 72,
    },
    {
      propositions: [578859, 578867], // Different Players - pra
      numPunters: 6,
      odds: 72,
    },
    {
      propositions: [578843, 578849], // Same player - steals - do not filter, steals is not in list
      numPunters: 6,
      odds: 72,
    },
    {
      propositions: [578843, 578850], // Different Players - steals
      numPunters: 6,
      odds: 72,
    },
  ];

  const aflPsgms = [
    {
      propositions: [15834, 15878], // Same player - disposals
      numPunters: 4,
      odds: 6.5,
    },
    {
      propositions: [15834, 15877], // Different Players - disposals
      numPunters: 3,
      odds: 201.0,
    },
    {
      propositions: [15569, 15613], // Same player - to kick a goal
      numPunters: 4,
      odds: 6.5,
    },
    {
      propositions: [15569, 15612], // Different Players - to kick a goal
      numPunters: 3,
      odds: 201.0,
    },
    {
      propositions: [15569, 15613, 23878], // same Players - to kick a goal (incl quarter)
      numPunters: 3,
      odds: 201.0,
    },
  ];

  const nrlPsgms = [
    {
      propositions: [69173, 69293], // Same player - to score a try
      numPunters: 4,
      odds: 6.5,
    },
    {
      propositions: [69173, 69294], // Different Players - to score a try
      numPunters: 3,
      odds: 201.0,
    },
  ];

  beforeEach(() => {
    sinon.stub(config, 'getDynamicConfig');
    config.getDynamicConfig.returns({
      ...dynamicConfig,
      sgmVulnerableBetGroups: [
        '^To Score (a|\\d+\\+) Tr(y|ies)$',
        '^To Kick (a|\\d+\\+) Goal(s?)$',
        '\\d+\\+ Disposals',
        '\\d+\\+ Points',
        '\\d+\\+ Assists',
        '\\d+\\+ Rebounds',
        '\\d+\\+ Blocks',
        '\\d+\\+ PRA',
      ],
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return psgms unfiltered if vulnerable bet groups defined is empty', () => {
    config.getDynamicConfig.returns({
      ...dynamicConfig,
      sgmVulnerableBetGroups: [],
    });

    const actual = trendingSgmGroupTransformer
      .getTrendingSgmGroup(nbaMatch, nbaPsgms, { jurisdiction: 'NSW' });

    actual.data[0].data.length.should.eql(10);
  });

  describe('nba competition', () => {
    it('should only filter out combinations for same players from same group', () => {
      const expected = {
        title: 'Popular Same Game Multi',
        data: [
          {
            betOption: 'Popular Same Game Multi 6',
            type: 'sports.trending.samegamemulti',
            data: [
              {
                title: '2 Leg Same Game Multi',
                subtitle: '6 punters',
                odds: 72,
                legs: [
                  {
                    betOption: '4+ Rebounds',
                    betOptionPriority: 5190,
                    proposition: {
                      id: '578720',
                      numberId: 578720,
                      number: 578720,
                      name: 'Jaylin Williams (OKC)',
                      position: undefined,
                      sortOrder: 5,
                      returnWin: 1.13,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                  {
                    betOption: '6+ Rebounds',
                    betOptionPriority: 5195,
                    proposition: {
                      id: '578736',
                      numberId: 578736,
                      number: 578736,
                      name: 'Josh Giddey (OKC)',
                      position: undefined,
                      sortOrder: 6,
                      returnWin: 1.1,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                ],
                sortOrder: 2,
              },
              {
                title: '2 Leg Same Game Multi',
                subtitle: '6 punters',
                odds: 72,
                legs: [
                  {
                    betOption: '4+ Assists',
                    betOptionPriority: 5230,
                    proposition: {
                      id: '578648',
                      numberId: 578648,
                      number: 578648,
                      name: 'Josh Giddey (OKC)',
                      position: undefined,
                      sortOrder: 5,
                      returnWin: 1.06,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                  {
                    betOption: '6+ Assists',
                    betOptionPriority: 5235,
                    proposition: {
                      id: '578663',
                      numberId: 578663,
                      number: 578663,
                      name: 'Kelly Olynyk (UTA)',
                      position: undefined,
                      sortOrder: 2,
                      returnWin: 2,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                ],
                sortOrder: 4,
              },
              {
                title: '2 Leg Same Game Multi',
                subtitle: '6 punters',
                odds: 72,
                legs: [
                  {
                    betOption: '25+ PRA',
                    betOptionPriority: 2910,
                    proposition: {
                      id: '578859',
                      numberId: 578859,
                      number: 578859,
                      name: 'Josh Giddey (OKC)',
                      position: undefined,
                      sortOrder: 6,
                      returnWin: 1.07,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                  {
                    betOption: '30+ PRA',
                    betOptionPriority: 2915,
                    proposition: {
                      id: '578867',
                      numberId: 578867,
                      number: 578867,
                      name: 'Kelly Olynyk (UTA)',
                      position: undefined,
                      sortOrder: 2,
                      returnWin: 1.68,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                ],
                sortOrder: 6,
              },
              {
                title: '2 Leg Same Game Multi',
                subtitle: '6 punters',
                odds: 72,
                legs: [
                  {
                    betOption: '2+ Steals',
                    betOptionPriority: 5345,
                    proposition: {
                      id: '578843',
                      numberId: 578843,
                      number: 578843,
                      name: 'Shai G-Alexander (OKC)',
                      position: undefined,
                      sortOrder: 5,
                      returnWin: 1.7,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                  {
                    betOption: '4+ Steals',
                    betOptionPriority: 5350,
                    proposition: {
                      id: '578849',
                      numberId: 578849,
                      number: 578849,
                      name: 'Shai G-Alexander (OKC)',
                      position: undefined,
                      sortOrder: 1,
                      returnWin: 6,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                ],
                sortOrder: 7,
              },
              {
                title: '2 Leg Same Game Multi',
                subtitle: '6 punters',
                odds: 72,
                legs: [
                  {
                    betOption: '2+ Steals',
                    betOptionPriority: 5345,
                    proposition: {
                      id: '578843',
                      numberId: 578843,
                      number: 578843,
                      name: 'Shai G-Alexander (OKC)',
                      position: undefined,
                      sortOrder: 5,
                      returnWin: 1.7,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                  {
                    betOption: '4+ Steals',
                    betOptionPriority: 5350,
                    proposition: {
                      id: '578850',
                      numberId: 578850,
                      number: 578850,
                      name: 'Jalen Williams (OKC)',
                      position: undefined,
                      sortOrder: 2,
                      returnWin: 7,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                ],
                sortOrder: 8,
              },
              {
                title: '2 Leg Same Game Multi',
                subtitle: '3 punters',
                odds: 201,
                legs: [
                  {
                    betOption: '10+ Points',
                    betOptionPriority: 2855,
                    proposition: {
                      id: '578528',
                      numberId: 578528,
                      number: 578528,
                      name: 'Ochai Agbaji (UTA)',
                      position: undefined,
                      sortOrder: 2,
                      returnWin: 1.11,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                  {
                    betOption: '15+ Points',
                    betOptionPriority: 2860,
                    proposition: {
                      id: '578551',
                      numberId: 578551,
                      number: 578551,
                      name: 'Josh Giddey (OKC)',
                      position: undefined,
                      sortOrder: 4,
                      returnWin: 1.19,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                ],
                sortOrder: 10,
              },
            ],
            enabledPsgmTweak: false,
          },
        ],
      };

      const actual = trendingSgmGroupTransformer
        .getTrendingSgmGroup(nbaMatch, nbaPsgms, { jurisdiction: 'NSW' });

      actual.should.eql(expected);
    });
  });

  describe('afl competition', () => {
    it('should only filter out combinations for same players from same group', () => {
      const expected = {
        title: 'Popular Same Game Multi',
        data: [
          {
            betOption: 'Popular Same Game Multi 3',
            type: 'sports.trending.samegamemulti',
            data: [
              {
                title: '2 Leg Same Game Multi',
                subtitle: '3 punters',
                odds: 201,
                legs: [
                  {
                    betOption: '15+ Disposals',
                    betOptionPriority: 2985,
                    proposition: {
                      id: '15834',
                      numberId: 15834,
                      number: 15834,
                      name: 'Ben Keays (ADE)',
                      position: undefined,
                      sortOrder: 3,
                      returnWin: 1.06,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                  {
                    betOption: '20+ Disposals',
                    betOptionPriority: 2990,
                    proposition: {
                      id: '15877',
                      numberId: 15877,
                      number: 15877,
                      name: 'Jordan Dawson (ADE)',
                      position: undefined,
                      sortOrder: 2,
                      returnWin: 1.28,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                ],
                sortOrder: 3,
              },
              {
                title: '2 Leg Same Game Multi',
                subtitle: '3 punters',
                odds: 201,
                legs: [
                  {
                    betOption: 'To Kick A Goal',
                    betOptionPriority: 2955,
                    proposition: {
                      id: '15569',
                      numberId: 15569,
                      number: 15569,
                      name: 'Taylor Walker (ADE)',
                      position: undefined,
                      sortOrder: 2,
                      returnWin: 1.13,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                  {
                    betOption: 'To Kick 2+ Goals',
                    betOptionPriority: 2960,
                    proposition: {
                      id: '15612',
                      numberId: 15612,
                      number: 15612,
                      name: 'Izak Rankine (ADE)',
                      position: undefined,
                      sortOrder: 1,
                      returnWin: 1.65,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                ],
                sortOrder: 4,
              },
              {
                title: '3 Leg Same Game Multi',
                subtitle: '3 punters',
                odds: 201,
                legs: [
                  {
                    betOption: 'To Kick A Goal',
                    betOptionPriority: 2955,
                    proposition: {
                      id: '15569',
                      numberId: 15569,
                      number: 15569,
                      name: 'Taylor Walker (ADE)',
                      position: undefined,
                      sortOrder: 2,
                      returnWin: 1.13,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                  {
                    betOption: 'To Kick 2+ Goals',
                    betOptionPriority: 2960,
                    proposition: {
                      id: '15613',
                      numberId: 15613,
                      number: 15613,
                      name: 'Taylor Walker (ADE)',
                      position: undefined,
                      sortOrder: 2,
                      returnWin: 1.65,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                  {
                    betOption: 'To Kick A Goal (1st Quarter)',
                    betOptionPriority: 3555,
                    proposition: {
                      id: '23878',
                      numberId: 23878,
                      number: 23878,
                      name: 'Taylor Walker (ADE)',
                      position: undefined,
                      sortOrder: 2,
                      returnWin: 2.5,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                ],
                sortOrder: 5,
              },
            ],
            enabledPsgmTweak: false,
          },
        ],
      };

      const actual = trendingSgmGroupTransformer
        .getTrendingSgmGroup(aflMatch, aflPsgms, { jurisdiction: 'NSW' });
      actual.should.eql(expected);
    });
  });

  describe('nrl competition', () => {
    it('should only filter out combinations for same players from same group', () => {
      const expected = {
        title: 'Popular Same Game Multi',
        data: [
          {
            betOption: 'Popular Same Game Multi 1',
            type: 'sports.trending.samegamemulti',
            data: [
              {
                title: '2 Leg Same Game Multi',
                subtitle: '3 punters',
                odds: 201,
                legs: [
                  {
                    betOption: 'To Score a Try',
                    betOptionPriority: 2365,
                    proposition: {
                      id: '69173',
                      numberId: 69173,
                      number: 69173,
                      name: 'Scott Drinkwater (NQ)',
                      position: undefined,
                      sortOrder: 1,
                      returnWin: 1.9,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                  {
                    betOption: 'To Score 2+ Tries',
                    betOptionPriority: 3370,
                    proposition: {
                      id: '69294',
                      numberId: 69294,
                      number: 69294,
                      name: 'Kyle Feldt (NQ)',
                      position: undefined,
                      sortOrder: 2,
                      returnWin: 4,
                      returnPlace: 0,
                      bettingStatus: 'Open',
                      isOpen: true,
                      allowPlace: false,
                      icon: undefined,
                    },
                  },
                ],
                sortOrder: 2,
              },
            ],
            enabledPsgmTweak: false,
          },
        ],
      };

      const actual = trendingSgmGroupTransformer
        .getTrendingSgmGroup(nrlMatch, nrlPsgms, { jurisdiction: 'NSW' });

      actual.should.eql(expected);
    });
  });
});
