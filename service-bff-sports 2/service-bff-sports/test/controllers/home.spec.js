const should = require('should');
const sinon = require('sinon');

const aemSportData = require('../mocks/aem/sport.data.json');
const aemSportPromoData = require('../mocks/aem/sport.promo.visbility.json');
const infoUpcoming = require('../mocks/info-wift/next-to-go.json');
const { liveEvents, liveEventSingleSport } = require('../mocks/recomm-service/live-events');
const { n2g, n2g1, ntgSingleSport } = require('../mocks/recomm-service/n2g');

const requestCache = require(`${global.SRC}/request-cache`);
const config = require(`${global.SRC}/config`);
const homeCtrl = require(`${global.SRC}/controllers/home`);
const log = require(`${global.SRC}/log`);

const sportsInfo = [{
  name: 'Basketball',
  displayName: 'Basketball',
  spectrumId: '4',
  sameGame: true,
  competitions: [
    {
      name: 'NBA',
      sameGame: true,
      tournaments: [],
    },
    {
      name: 'NFL',
      sameGame: true,
      tournaments: [],
    },
  ],
},
{
  name: 'Volleyball',
  displayName: 'Volleyball',
  spectrumId: '32',
  sameGame: false,
  competitions: [
    {
      name: 'A League Men',
      sameGame: true,
      tournaments: [],
    },
    {
      name: 'UEFA Europa League',
      sameGame: true,
      tournaments: [],
    },
  ],
},
{
  name: 'Tennis',
  displayName: 'Tennis',
  spectrumId: '11',
  sameGame: false,
  competitions: [
    {
      name: 'Masters',
      tournaments: [
        {
          name: 'Masters Indian Wells',
        },
      ],
    },
  ],
},
{
  name: 'Hockey',
  displayName: 'Hockey',
  spectrumId: '20',
  sameGame: false,
  competitions: [
    {
      name: 'National Hockey League',
      sameGame: true,
      tournaments: [],
    },
  ],
},
{
  name: 'Sports Exotics',
  displayName: 'Retail Offers',
  spectrumId: '48',
  sameGame: true,
  competitions: [
    {
      name: 'Racing Retail Offer',
      tournaments: [],
    },
  ],
},
{
  name: 'Todays Offers',
  displayName: 'Todays Offers',
  spectrumId: '53',
  sameGame: true,
  competitions: [
    {
      name: 'Sports Offer',
      tournaments: [],
    },
  ],
},
{
  name: 'Rugby League',
  displayName: 'Rugby League',
  spectrumId: '10',
  sameGame: true,
  competitions: [
    {
      name: 'NRL',
      tournaments: [],
    },
  ],
},
{
  name: 'Boxing',
  displayName: 'Boxing',
  spectrumId: '5',
  sameGame: true,
  competitions: [
    {
      name: 'Boxing',
      tournaments: [],
    },
  ],
}];

const sportsInfoWithMatchDetails = [
  {
    name: 'Hockey',
    displayName: 'Hockey',
    spectrumId: '20',
    sameGame: false,
    competitions: [
      {
        name: 'National Hockey League',
        sameGame: true,
        tournaments: [],
        matches: [
          {
            id: 'FHKY1T1M01',
            name: 'FIELDHOCKY MATCH - C1T1M01',
            spectrumUniqueId: 1371994,
          },
        ],
      },
    ],
  },
  {
    name: 'Soccer',
    displayName: 'Soccer',
    spectrumId: '3',
    sameGame: false,
    competitions: [
      {

        name: 'Major League Soccer',
        tournaments: [],
        matches: [{
          id: 'LAFCvHstn',
          name: 'Los Angeles FC v Houston',
          spectrumUniqueId: 1371752,
        }],
      },
    ],
  },
  {
    name: 'Tennis',
    displayName: 'Tennis',
    spectrumId: '11',
    sameGame: false,
    competitions: [
      {
        name: 'Masters',
        tournaments: [
          {
            name: 'Masters Indian Wells',
            matches: [{
              id: 'GastvMtet',
              name: 'Gaston v Moutet',
              spectrumUniqueId: 1369583,
            }, {
              id: 'TsngvSimn',
              name: 'Tsonga v Simon',
              spectrumUniqueId: 1371576,
            }],
          },
        ],
      },
    ],
  },
  {
    name: 'Sports Exotics',
    displayName: 'Retail Offers',
    spectrumId: '48',
    sameGame: true,
    competitions: [
      {
        name: 'Racing Retail Offer',
        tournaments: [],
        matches: [{
          id: 'ASptRetDly',
          name: 'AFL Venue Mode Exclusive',
          spectrumUniqueId: 1371952,
        }, {
          id: '4SVM1502',
          name: 'Cricket Venue Mode Offer Tuesday',
          spectrumUniqueId: 1355851,
        }],
      },
    ],
  },
  {
    name: 'Todays Offers',
    displayName: 'Todays Offers',
    spectrumId: '53',
    sameGame: true,
    competitions: [
      {
        name: 'Sports Offer',
        tournaments: [],
        matches: [{
          id: '1SAO0309',
          name: 'NRL Friday Night Offer',
          spectrumUniqueId: 1349459,
        }],
      },
    ],
  },
  {
    name: 'Rugby League',
    displayName: 'Rugby League',
    spectrumId: '10',
    sameGame: true,
    competitions: [
      {
        name: 'NRL',
        tournaments: [],
        matches: [
          {
            id: 'NQldvPenr',
            name: 'Nth Qld v Penrith',
            spectrumUniqueId: 1371142,
          },
          {
            id: 'NewcvSydR',
            name: 'Newcastle v Syd Roosters',
            spectrumUniqueId: 1371143,
          },
        ],
      },
    ],
  },
  {
    name: 'Basketball',
    displayName: 'Basketball',
    spectrumId: '4',
    sameGame: true,
    competitions: [
      {
        name: 'NBA',
        sameGame: true,
        tournaments: [],
      },
      {
        name: 'NFL',
        sameGame: true,
        tournaments: [],
      },
    ],
  },
];

const assertSportsData = (resData) => {
  resData.type.should.eql('sports.home.tab');
  resData.discoveryKey.should.eql('bff:sports:all');
  resData.data.length.should.eql(2);
  resData.data[0].title.should.eql('Featured');
  resData.data[0].data.should.eql([
    {
      displayName: 'National Hockey League',
      sameGame: true,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'hockey',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'Hockey',
          competitionName: 'National Hockey League',
          matchName: 'FIELDHOCKY MATCH - C1T1M01',
        },
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
      },
    },
    {
      displayName: 'Major League Soccer',
      sameGame: false,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'soccer',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'Soccer',
          competitionName: 'Major League Soccer',
          matchName: 'Los Angeles FC v Houston',
        },
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
      },
    },
    {
      displayName: 'Masters Indian Wells',
      sameGame: false,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'tennis',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'Tennis',
          competitionName: 'Masters',
          tournamentName: 'Masters Indian Wells',
        },
        template: 'screen:sport:tournament',
        discoveryKey: 'bff:sports:tournament',
      },
    },
    {
      displayName: 'NRL',
      sameGame: false,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'rugby_league',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: { sportName: 'Rugby League', competitionName: 'NRL' },
        template: 'screen:sport:competition',
        discoveryKey: 'bff:sports:competition',
      },
    },
    {
      displayName: 'NBA',
      sameGame: true,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'basketball',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: { sportName: 'Basketball', competitionName: 'NBA' },
        template: 'screen:sport:competition',
        discoveryKey: 'bff:sports:competition',
      },
    },
  ]);
  resData.data[1].title.should.eql('A - Z');
  resData.data[1].data.should.eql([
    {
      displayName: 'Basketball',
      spectrumId: '4',
      sameGame: true,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'basketball',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: { sportName: 'Basketball' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
    {
      displayName: 'Hockey',
      spectrumId: '20',
      sameGame: false,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'hockey',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: { sportName: 'Hockey' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
    {
      displayName: 'Rugby League',
      spectrumId: '10',
      sameGame: true,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'rugby_league',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: { sportName: 'Rugby League' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
    {
      displayName: 'Soccer',
      spectrumId: '3',
      sameGame: false,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'soccer',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: { sportName: 'Soccer' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
    {
      displayName: 'Tennis',
      spectrumId: '11',
      sameGame: false,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'tennis',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: { sportName: 'Tennis' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
    {
      displayName: 'Todays Offers',
      spectrumId: '53',
      sameGame: true,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'todays_offers',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: { sportName: 'Todays Offers' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
  ]);
};

const assertResultsData = (resData) => {
  resData.type.should.eql('sports.home.results');
  resData.discoveryKey.should.eql('bff:sports:results');
  resData.data.length.should.eql(8);
  resData.data.should.eql([
    {
      displayName: 'Basketball',
      spectrumId: '4',
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'basketball',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'Basketball',
        },
        template: 'screen:sport:result',
        discoveryKey: 'bff:sports:sport:results',
      },
    },
    {
      displayName: 'Volleyball',
      spectrumId: '32',
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'volleyball',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'Volleyball',
        },
        template: 'screen:sport:result',
        discoveryKey: 'bff:sports:sport:results',
      },
    },
    {
      displayName: 'Tennis',
      spectrumId: '11',
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'tennis',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'Tennis',
        },
        template: 'screen:sport:result',
        discoveryKey: 'bff:sports:sport:results',
      },
    },
    {
      displayName: 'Hockey',
      spectrumId: '20',
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'hockey',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'Hockey',
        },
        template: 'screen:sport:result',
        discoveryKey: 'bff:sports:sport:results',
      },
    },
    {
      displayName: 'Retail Offers',
      spectrumId: '48',
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'sports_exotics',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'Sports Exotics',
        },
        template: 'screen:sport:result',
        discoveryKey: 'bff:sports:sport:results',
      },
    },
    {
      displayName: 'Todays Offers',
      spectrumId: '53',
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'todays_offers',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'Todays Offers',
        },
        template: 'screen:sport:result',
        discoveryKey: 'bff:sports:sport:results',
      },
    },
    {
      displayName: 'Rugby League',
      spectrumId: '10',
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'rugby_league',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'Rugby League',
        },
        template: 'screen:sport:result',
        discoveryKey: 'bff:sports:sport:results',
      },
    },
    {
      displayName: 'Boxing',
      spectrumId: '5',
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'boxing',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'Boxing',
        },
        template: 'screen:sport:result',
        discoveryKey: 'bff:sports:sport:results',
      },
    },
  ]);
};

const assertUpcomingData = (resData) => {
  resData.should.eql([
    {
      type: 'app.sports.timeGroups',
      groups: [
        'Today',
        'Tomorrow',
        'dd/mm/yyyy',
      ],
      data: [
        {
          type: 'sports.propositions.horizontal',
          shortName: 'Col OrgS-USC Hd to Hd',
          startTime: '2022-02-25T04:00:00.000Z',
          subTitle: 'NCAA Basketball',
          title: 'Oregon State v USC',
          allowMulti: true,
          betOption: 'Head To Head',
          cashOutEligibility: 'Enabled',
          displayTime: '2022-02-25T04:00:00.000Z',
          goingInPlay: false,
          hasVision: false,
          icon: {
            appIconIdentifier: 'basketball',
            imageURL: '',
            keepOriginalColor: false,
          },
          inPlay: false,
          marketsCount: 5,
          matchId: 'OrgSvUSC',
          message: null,
          navigation: {
            discoveryKey: 'bff:sports:match:page',
            params: {
              competitionName: 'NCAA Basketball',
              matchName: 'Oregon State v USC',
              sportName: 'Basketball',
            },
            template: 'screen:sport:match',
          },
          onlineBetting: false,
          phoneBettingOnly: true,
          promoAvailable: true,
          propositions: [
            {
              allowPlace: false,
              bettingStatus: 'Open',
              id: '649518',
              isOpen: true,
              name: 'Oregon State',
              number: 649518,
              numberId: 649518,
              position: 'HOME',
              returnPlace: 0,
              returnWin: 2,
              sortOrder: 1,
            },
            {
              allowPlace: false,
              bettingStatus: 'Open',
              id: '649519',
              isOpen: true,
              name: 'USC',
              number: 649519,
              numberId: 649519,
              position: 'AWAY',
              returnPlace: 0,
              returnWin: 1.72,
              sortOrder: 2,
            },
          ],
        },
        {
          type: 'sports.propositions.horizontal',
          title: 'Bonaventure v Bolsova',
          subTitle: 'ITFW Nur-Sultan',
          matchId: 'BnvtvBols',
          betOption: 'Head To Head',
          inPlay: false,
          goingInPlay: false,
          startTime: '2022-02-25T05:40:00.000Z',
          displayTime: '2022-02-25T05:40:00.000Z',
          hasVision: true,
          cashOutEligibility: 'PreMatch',
          promoAvailable: false,
          marketsCount: 5,
          shortName: 'TFW Nur Bnvt-Bols Hd to Hd',
          message: 'Match must be completed for bet to stand',
          allowMulti: true,
          icon: {
            appIconIdentifier: 'tennis',
            imageURL: '',
            keepOriginalColor: false,
          },
          onlineBetting: true,
          phoneBettingOnly: false,
          propositions: [
            {
              id: '400233',
              numberId: 400233,
              number: 400233,
              name: 'Bonaventure',
              position: 'HOME',
              sortOrder: 1,
              returnWin: 1.75,
              returnPlace: 0,
              bettingStatus: 'Open',
              isOpen: true,
              allowPlace: false,
            },
            {
              id: '400246',
              numberId: 400246,
              number: 400246,
              name: 'Bolsova',
              position: 'AWAY',
              sortOrder: 2,
              returnWin: 1.95,
              returnPlace: 0,
              bettingStatus: 'Open',
              isOpen: true,
              allowPlace: false,
            },
          ],
          navigation: {
            template: 'screen:sport:match',
            discoveryKey: 'bff:sports:tournament-match:page',
            params: {
              sportName: 'Tennis',
              competitionName: 'ITF Womens',
              tournamentName: 'ITFW Nur-Sultan',
              matchName: 'Bonaventure v Bolsova',
            },
          },
        },
        {
          type: 'sports.propositions.horizontal',
          title: 'Minnen v Savinykh',
          subTitle: 'ITFW Nur-Sultan',
          matchId: 'MnenvSvkh',
          betOption: 'Head To Head',
          inPlay: false,
          goingInPlay: false,
          startTime: '2022-02-25T05:45:00.000Z',
          displayTime: '2022-02-25T05:45:00.000Z',
          hasVision: true,
          cashOutEligibility: 'PreMatch',
          promoAvailable: false,
          marketsCount: 5,
          shortName: 'TFW Nur Mnen-Svkh Hd to Hd',
          message: 'Match must be completed for bet to stand',
          allowMulti: true,
          icon: {
            appIconIdentifier: 'tennis',
            imageURL: '',
            keepOriginalColor: false,
          },
          onlineBetting: true,
          phoneBettingOnly: false,
          propositions: [
            {
              id: '400210',
              numberId: 400210,
              number: 400210,
              name: 'Minnen',
              position: 'HOME',
              sortOrder: 1,
              returnWin: 1.09,
              returnPlace: 0,
              bettingStatus: 'Open',
              isOpen: true,
              allowPlace: false,
            },
            {
              id: '400211',
              numberId: 400211,
              number: 400211,
              name: 'Savinykh',
              position: 'AWAY',
              sortOrder: 2,
              returnWin: 6,
              returnPlace: 0,
              bettingStatus: 'Open',
              isOpen: true,
              allowPlace: false,
            },
          ],
          navigation: {
            template: 'screen:sport:match',
            discoveryKey: 'bff:sports:tournament-match:page',
            params: {
              sportName: 'Tennis',
              competitionName: 'ITF Womens',
              tournamentName: 'ITFW Nur-Sultan',
              matchName: 'Minnen v Savinykh',
            },
          },
        },
        {
          type: 'sports.propositions.horizontal',
          title: 'Australia v Taiwan',
          subTitle: 'FIBA World Cup Qualifiers',
          matchId: 'AusvTaiw',
          betOption: 'Head To Head',
          inPlay: false,
          goingInPlay: true,
          startTime: '2022-02-25T06:05:00.000Z',
          displayTime: '2022-02-25T06:05:00.000Z',
          hasVision: false,
          cashOutEligibility: 'Enabled',
          promoAvailable: false,
          marketsCount: 32,
          shortName: 'FWC Aus-Taiw Hd to Hd',
          message: null,
          allowMulti: true,
          icon: {
            appIconIdentifier: 'basketball',
            imageURL: '',
            keepOriginalColor: false,
          },
          onlineBetting: false,
          phoneBettingOnly: false,
          propositions: [
            {
              id: '671583',
              numberId: 671583,
              number: 671583,
              name: 'Australia',
              position: 'HOME',
              sortOrder: 1,
              returnWin: 1.01,
              returnPlace: 0,
              bettingStatus: 'Suspended',
              isOpen: false,
              allowPlace: false,
            },
            {
              id: '671584',
              numberId: 671584,
              number: 671584,
              name: 'Taiwan',
              position: 'AWAY',
              sortOrder: 2,
              returnWin: 17,
              returnPlace: 0,
              bettingStatus: 'Suspended',
              isOpen: false,
              allowPlace: false,
            },
          ],
          navigation: {
            template: 'screen:sport:match',
            discoveryKey: 'bff:sports:match:page',
            params: {
              sportName: 'Basketball',
              competitionName: 'FIBA World Cup Qualifiers',
              matchName: 'Australia v Taiwan',
            },
          },
        },
        {
          type: 'sports.propositions.horizontal',
          title: 'Road Warriors v Rain Shine Pntrs',
          subTitle: 'Philippines PBA Cup',
          matchId: 'RdWrvRnSP',
          betOption: 'Head To Head',
          inPlay: false,
          goingInPlay: true,
          startTime: '2022-02-25T07:00:00.000Z',
          displayTime: '2022-02-25T07:00:00.000Z',
          hasVision: true,
          cashOutEligibility: 'Enabled',
          promoAvailable: false,
          marketsCount: 22,
          shortName: 'PGC RdWr-RnSP Hd to Hd',
          message: null,
          allowMulti: true,
          icon: {
            appIconIdentifier: 'basketball',
            imageURL: '',
            keepOriginalColor: false,
          },
          onlineBetting: true,
          phoneBettingOnly: false,
          propositions: [
            {
              id: '647805',
              numberId: 647805,
              number: 647805,
              name: 'Road Warriors',
              position: 'HOME',
              sortOrder: 1,
              returnWin: 1.55,
              returnPlace: 0,
              bettingStatus: 'Open',
              isOpen: true,
              allowPlace: false,
            },
            {
              id: '647806',
              numberId: 647806,
              number: 647806,
              name: 'Rain Shine Pntrs',
              position: 'AWAY',
              sortOrder: 2,
              returnWin: 2.35,
              returnPlace: 0,
              bettingStatus: 'Open',
              isOpen: true,
              allowPlace: false,
            },
          ],
          navigation: {
            template: 'screen:sport:match',
            discoveryKey: 'bff:sports:match:page',
            params: {
              sportName: 'Basketball',
              competitionName: 'Philippines PBA Cup',
              matchName: 'Road Warriors v Rain Shine Pntrs',
            },
          },
        },
      ],
    },
  ]);
};

const assertInPlayData = (resData) => {
  resData.should.eql([
    {
      type: 'sports.propositions.horizontal',
      title: 'New Zealand v South Africa',
      subTitle: 'Test Matches',
      matchId: 'NZvSAf',
      betOption: 'Result',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-24T22:00:00.000Z',
      displayTime: '2022-02-26T22:00:00.000Z',
      hasVision: false,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 10,
      shortName: 'TST NZ-SAf Result',
      message: null,
      allowMulti: true,
      icon: {
        appIconIdentifier: 'cricket',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '600006',
          numberId: 600006,
          number: 600006,
          name: 'New Zealand',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 2.05,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '600009',
          numberId: 600009,
          number: 600009,
          name: 'Draw',
          position: 'DRAW',
          sortOrder: 2,
          returnWin: 15,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '600011',
          numberId: 600011,
          number: 600011,
          name: 'South Africa',
          position: 'AWAY',
          sortOrder: 3,
          returnWin: 1.9,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Cricket',
          competitionName: 'Test Matches',
          matchName: 'New Zealand v South Africa',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Milwaukee v Brooklyn',
      subTitle: 'NBA',
      matchId: 'MilvBkn',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T01:40:00.000Z',
      displayTime: '2022-02-27T01:40:00.000Z',
      hasVision: true,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 2,
      shortName: 'NBA Mil-Bkn Hd to Hd',
      message: null,
      allowMulti: true,
      icon: {
        appIconIdentifier: 'basketball',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '576043',
          numberId: 576043,
          number: 576043,
          name: 'Milwaukee',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 7.5,
          returnPlace: 0,
          bettingStatus: 'Suspended',
          isOpen: false,
          allowPlace: false,
          icon: {
            imageURL: 'https://metadata.beta.tab.com.au/icons/NBA%20logos/Milwaukee%20Bucks.svg',
          },
        },
        {
          id: '576044',
          numberId: 576044,
          number: 576044,
          name: 'Brooklyn',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 1.08,
          returnPlace: 0,
          bettingStatus: 'Suspended',
          isOpen: false,
          allowPlace: false,
          icon: {
            imageURL: 'https://metadata.beta.tab.com.au/icons/NBA%20logos/Brooklyn%20Nets.svg',
          },
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Basketball',
          competitionName: 'NBA',
          matchName: 'Milwaukee v Brooklyn',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Denver v Sacramento',
      subTitle: 'NBA',
      matchId: 'DenvSac',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T02:10:00.000Z',
      displayTime: '2022-02-27T02:10:00.000Z',
      hasVision: true,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 23,
      shortName: 'NBA Den-Sac Hd to Hd',
      message: null,
      allowMulti: true,
      icon: {
        appIconIdentifier: 'basketball',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '576045',
          numberId: 576045,
          number: 576045,
          name: 'Denver',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 1.28,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
          icon: {
            imageURL: 'https://metadata.beta.tab.com.au/icons/NBA%20logos/Denver%20Nuggets.svg',
          },
        },
        {
          id: '576046',
          numberId: 576046,
          number: 576046,
          name: 'Sacramento',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 3.6,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
          icon: {
            imageURL: 'https://metadata.beta.tab.com.au/icons/NBA%20logos/Sacramento%20Kings.svg',
          },
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Basketball',
          competitionName: 'NBA',
          matchName: 'Denver v Sacramento',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Oregon v USC',
      subTitle: 'NCAA Basketball',
      matchId: 'OrgnvUSC',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T03:00:00.000Z',
      displayTime: '2022-02-27T03:00:00.000Z',
      hasVision: false,
      cashOutEligibility: 'Enabled',
      promoAvailable: true,
      marketsCount: 5,
      shortName: 'Col Orgn-USC Hd to Hd',
      message: null,
      allowMulti: true,
      icon: {
        appIconIdentifier: 'basketball',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '625107',
          numberId: 625107,
          number: 625107,
          name: 'Oregon',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 1.5,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '625108',
          numberId: 625108,
          number: 625108,
          name: 'USC',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 2.4,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Basketball',
          competitionName: 'NCAA Basketball',
          matchName: 'Oregon v USC',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Saint Marys v Gonzaga',
      subTitle: 'NCAA Basketball',
      matchId: 'SMCvGnzg',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T03:00:00.000Z',
      displayTime: '2022-02-27T03:00:00.000Z',
      hasVision: false,
      cashOutEligibility: 'Enabled',
      promoAvailable: true,
      marketsCount: 5,
      shortName: 'Col SMC-Gnzg Hd to Hd',
      message: null,
      allowMulti: true,
      icon: {
        appIconIdentifier: 'basketball',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '625159',
          numberId: 625159,
          number: 625159,
          name: 'Saint Marys',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 1.2,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '625160',
          numberId: 625160,
          number: 625160,
          name: 'Gonzaga',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 4,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Basketball',
          competitionName: 'NCAA Basketball',
          matchName: 'Saint Marys v Gonzaga',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Utah v Arizona State',
      subTitle: 'NCAA Basketball',
      matchId: 'UtahvAriS',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T03:00:00.000Z',
      displayTime: '2022-02-27T03:00:00.000Z',
      hasVision: false,
      cashOutEligibility: 'Enabled',
      promoAvailable: true,
      marketsCount: 5,
      shortName: 'Col Utah-AriS Hd to Hd',
      message: null,
      allowMulti: true,
      icon: {
        appIconIdentifier: 'basketball',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '625694',
          numberId: 625694,
          number: 625694,
          name: 'Utah',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 3.8,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '625695',
          numberId: 625695,
          number: 625695,
          name: 'Arizona State',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 1.22,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Basketball',
          competitionName: 'NCAA Basketball',
          matchName: 'Utah v Arizona State',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'UNLV v Boise State',
      subTitle: 'NCAA Basketball',
      matchId: 'UNLVvBoiS',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T03:00:00.000Z',
      displayTime: '2022-02-27T03:00:00.000Z',
      hasVision: false,
      cashOutEligibility: 'Enabled',
      promoAvailable: true,
      marketsCount: 5,
      shortName: 'Col UNLV-BoiS Hd to Hd',
      message: null,
      allowMulti: true,
      icon: {
        appIconIdentifier: 'basketball',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '630605',
          numberId: 630605,
          number: 630605,
          name: 'UNLV',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 1.9,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '630606',
          numberId: 630606,
          number: 630606,
          name: 'Boise State',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 1.8,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Basketball',
          competitionName: 'NCAA Basketball',
          matchName: 'UNLV v Boise State',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Portland State v Idaho State',
      subTitle: 'NCAA Basketball',
      matchId: 'PrtSvIdhS',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T03:00:00.000Z',
      displayTime: '2022-02-27T03:00:00.000Z',
      hasVision: false,
      cashOutEligibility: 'Enabled',
      promoAvailable: true,
      marketsCount: 5,
      shortName: 'Col PrtS-IdhS Hd to Hd',
      message: null,
      allowMulti: true,
      icon: {
        appIconIdentifier: 'basketball',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '634049',
          numberId: 634049,
          number: 634049,
          name: 'Portland State',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 2.25,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '634050',
          numberId: 634050,
          number: 634050,
          name: 'Idaho State',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 1.58,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Basketball',
          competitionName: 'NCAA Basketball',
          matchName: 'Portland State v Idaho State',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Pumas UNAM v CF America',
      subTitle: 'Mexico Primera',
      matchId: 'PumavAmrc',
      betOption: 'Result',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T03:00:00.000Z',
      displayTime: '2022-02-27T03:00:00.000Z',
      hasVision: true,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 48,
      shortName: 'Mex Puma-Amrc Result',
      message: 'Normal Time',
      allowMulti: true,
      icon: {
        appIconIdentifier: 'soccer',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '297226',
          numberId: 297226,
          number: 297226,
          name: 'Pumas UNAM',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 3.4,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '297231',
          numberId: 297231,
          number: 297231,
          name: 'Draw',
          position: 'DRAW',
          sortOrder: 2,
          returnWin: 2.05,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '297236',
          numberId: 297236,
          number: 297236,
          name: 'CF America',
          position: 'AWAY',
          sortOrder: 3,
          returnWin: 3.25,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Soccer',
          competitionName: 'Mexico Primera',
          matchName: 'Pumas UNAM v CF America',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Calgary v Minnesota',
      subTitle: 'National Hockey League',
      matchId: 'CgrvMin',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T03:05:00.000Z',
      displayTime: '2022-02-27T03:05:00.000Z',
      hasVision: false,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 32,
      shortName: 'NHL Cgr-Min Hd to Hd',
      message: 'Includes Overtime and Shootout',
      allowMulti: true,
      icon: {
        appIconIdentifier: 'ice_hockey',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '196434',
          numberId: 196434,
          number: 196434,
          name: 'Calgary',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 1.1,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
          icon: {
            imageURL: 'https://metadata.beta.tab.com.au/icons/NHL/Calgary%20Flames.svg',
          },
        },
        {
          id: '196436',
          numberId: 196436,
          number: 196436,
          name: 'Minnesota',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 6.5,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
          icon: {
            imageURL: 'https://metadata.beta.tab.com.au/icons/NHL/Minnesota%20Wild.svg',
          },
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Ice Hockey',
          competitionName: 'National Hockey League',
          matchName: 'Calgary v Minnesota',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Las Vegas v Colorado',
      subTitle: 'National Hockey League',
      matchId: 'LVvCol0',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T03:05:00.000Z',
      displayTime: '2022-02-27T03:05:00.000Z',
      hasVision: false,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 31,
      shortName: 'NHL LV-Col Hd to Hd',
      message: 'Includes Overtime and Shootout',
      allowMulti: true,
      icon: {
        appIconIdentifier: 'ice_hockey',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '195196',
          numberId: 195196,
          number: 195196,
          name: 'Las Vegas',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 1.52,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '195197',
          numberId: 195197,
          number: 195197,
          name: 'Colorado',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 2.5,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
          icon: {
            imageURL: 'https://metadata.beta.tab.com.au/icons/NHL/Colorado%20Avalanche.svg',
          },
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Ice Hockey',
          competitionName: 'National Hockey League',
          matchName: 'Las Vegas v Colorado',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'San Jose v Boston',
      subTitle: 'National Hockey League',
      matchId: 'SnJsvBos',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T03:05:00.000Z',
      displayTime: '2022-02-27T03:05:00.000Z',
      hasVision: false,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 31,
      shortName: 'NHL SnJs-Bos Hd to Hd',
      message: 'Includes Overtime and Shootout',
      allowMulti: true,
      icon: {
        appIconIdentifier: 'ice_hockey',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '196168',
          numberId: 196168,
          number: 196168,
          name: 'San Jose',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 4.2,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
          icon: {
            imageURL: 'https://metadata.beta.tab.com.au/icons/NHL/San%20Jose%20Sharks.svg',
          },
        },
        {
          id: '196169',
          numberId: 196169,
          number: 196169,
          name: 'Boston',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 1.22,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
          icon: {
            imageURL: 'https://metadata.beta.tab.com.au/icons/NHL/Boston%20Bruins.svg',
          },
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Ice Hockey',
          competitionName: 'National Hockey League',
          matchName: 'San Jose v Boston',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Nadal v Norrie',
      subTitle: 'ATP Acapulco',
      matchId: 'NadlvNorr',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T03:17:52.000Z',
      displayTime: '2022-02-27T03:17:52.000Z',
      hasVision: true,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 42,
      shortName: 'ATP Aca Nadl-Norr Hd to Hd',
      message: 'Match must be completed for bet to stand',
      allowMulti: true,
      icon: {
        appIconIdentifier: 'tennis',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '640045',
          numberId: 640045,
          number: 640045,
          name: 'Nadal',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 1.01,
          returnPlace: 0,
          bettingStatus: 'Suspended',
          isOpen: false,
          allowPlace: false,
        },
        {
          id: '640046',
          numberId: 640046,
          number: 640046,
          name: 'Norrie',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 21,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:tournament-match:page',
        params: {
          sportName: 'Tennis',
          competitionName: 'ATP',
          tournamentName: 'ATP Acapulco',
          matchName: 'Nadal v Norrie',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Bouzkova v Wang Q',
      subTitle: 'WTA Guadalajara',
      matchId: 'BzkvvWngQ',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T03:19:19.000Z',
      displayTime: '2022-02-27T03:19:19.000Z',
      hasVision: true,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 38,
      shortName: 'WTA Gua Bzkv-WngQ Hd to Hd',
      message: 'Match must be completed for bet to stand',
      allowMulti: true,
      icon: {
        appIconIdentifier: 'tennis',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '635178',
          numberId: 635178,
          number: 635178,
          name: 'Bouzkova',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 1.46,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '635179',
          numberId: 635179,
          number: 635179,
          name: 'Wang Q',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 2.6,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:tournament-match:page',
        params: {
          sportName: 'Tennis',
          competitionName: 'WTA',
          tournamentName: 'WTA Guadalajara',
          matchName: 'Bouzkova v Wang Q',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Los Angeles v NY Islanders',
      subTitle: 'National Hockey League',
      matchId: 'LAvNIsl',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T03:35:00.000Z',
      displayTime: '2022-02-27T03:35:00.000Z',
      hasVision: false,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 32,
      shortName: 'NHL LA-NIsl Hd to Hd',
      message: 'Includes Overtime and Shootout',
      allowMulti: true,
      icon: {
        appIconIdentifier: 'ice_hockey',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '197782',
          numberId: 197782,
          number: 197782,
          name: 'Los Angeles',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 1.12,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
          icon: {
            imageURL: 'https://metadata.beta.tab.com.au/icons/NHL/LA%20Kings.svg',
          },
        },
        {
          id: '197784',
          numberId: 197784,
          number: 197784,
          name: 'NY Islanders',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 6,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
          icon: {
            imageURL: 'https://metadata.beta.tab.com.au/icons/NHL/New%20York%20Islanders.svg',
          },
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Ice Hockey',
          competitionName: 'National Hockey League',
          matchName: 'Los Angeles v NY Islanders',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Heidelberg Utd v Dandenong Thndr',
      subTitle: 'Australia NPL Victoria',
      matchId: 'HeidvDndT',
      betOption: 'Result',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T04:00:00.000Z',
      displayTime: '2022-02-27T04:00:00.000Z',
      hasVision: false,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 60,
      shortName: 'NPL Heid-DndT Result',
      message: 'Normal Time',
      allowMulti: true,
      icon: {
        appIconIdentifier: 'soccer',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '454327',
          numberId: 454327,
          number: 454327,
          name: 'Heidelberg Utd',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 2.3,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '454335',
          numberId: 454335,
          number: 454335,
          name: 'Draw',
          position: 'DRAW',
          sortOrder: 2,
          returnWin: 3.3,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '454350',
          numberId: 454350,
          number: 454350,
          name: 'Dandenong Thndr',
          position: 'AWAY',
          sortOrder: 3,
          returnWin: 2.8,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Soccer',
          competitionName: 'Australia NPL Victoria',
          matchName: 'Heidelberg Utd v Dandenong Thndr',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Kumamoto v MontedioYamagata',
      subTitle: 'Japan J2 League',
      matchId: 'KumavMYgt',
      betOption: 'Result',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T04:00:00.000Z',
      displayTime: '2022-02-27T04:00:00.000Z',
      hasVision: true,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 80,
      shortName: 'JL2 Kuma-MYgt Result',
      message: 'Normal Time',
      allowMulti: true,
      icon: {
        appIconIdentifier: 'soccer',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '307774',
          numberId: 307774,
          number: 307774,
          name: 'Kumamoto',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 7,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '307777',
          numberId: 307777,
          number: 307777,
          name: 'Draw',
          position: 'DRAW',
          sortOrder: 2,
          returnWin: 4.5,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '307779',
          numberId: 307779,
          number: 307779,
          name: 'MontedioYamagata',
          position: 'AWAY',
          sortOrder: 3,
          returnWin: 1.4,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Soccer',
          competitionName: 'Japan J2 League',
          matchName: 'Kumamoto v MontedioYamagata',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Ventforet Kofu v Oita Trinita',
      subTitle: 'Japan J2 League',
      matchId: 'VntfvOiTn',
      betOption: 'Result',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T04:00:00.000Z',
      displayTime: '2022-02-27T04:00:00.000Z',
      hasVision: true,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 82,
      shortName: 'JL2 Vntf-OiTn Result',
      message: 'Normal Time',
      allowMulti: true,
      icon: {
        appIconIdentifier: 'soccer',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '308870',
          numberId: 308870,
          number: 308870,
          name: 'Ventforet Kofu',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 2.5,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '308875',
          numberId: 308875,
          number: 308875,
          name: 'Draw',
          position: 'DRAW',
          sortOrder: 2,
          returnWin: 2.7,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '308877',
          numberId: 308877,
          number: 308877,
          name: 'Oita Trinita',
          position: 'AWAY',
          sortOrder: 3,
          returnWin: 3.3,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Soccer',
          competitionName: 'Japan J2 League',
          matchName: 'Ventforet Kofu v Oita Trinita',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Cairns v Melbourne',
      subTitle: 'NBL',
      matchId: 'CnsvMel',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T04:10:00.000Z',
      displayTime: '2022-02-27T04:10:00.000Z',
      hasVision: false,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 26,
      shortName: 'NBL Cns-Mel Hd to Hd',
      message: null,
      allowMulti: true,
      icon: {
        appIconIdentifier: 'basketball',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '631504',
          numberId: 631504,
          number: 631504,
          name: 'Cairns',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 3.8,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
          icon: {
            imageURL: 'https://metadata.beta.tab.com.au/icons/NBL/Cairns%20Taipans.svg',
          },
        },
        {
          id: '631505',
          numberId: 631505,
          number: 631505,
          name: 'Melbourne',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 1.24,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
          icon: {
            imageURL: 'https://metadata.beta.tab.com.au/icons/NBL/Melbourne%20United.svg',
          },
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Basketball',
          competitionName: 'NBL',
          matchName: 'Cairns v Melbourne',
        },
      },
    },
    {
      type: 'sports.propositions.horizontal',
      title: 'Collingwood (W) v Wst Bulldogs (W)',
      subTitle: 'AFL Womens',
      matchId: 'CollvWBd',
      betOption: 'Head To Head',
      inPlay: true,
      goingInPlay: false,
      startTime: '2022-02-27T04:10:00.000Z',
      displayTime: '2022-02-27T04:10:00.000Z',
      hasVision: false,
      cashOutEligibility: 'Enabled',
      promoAvailable: false,
      marketsCount: 5,
      shortName: 'AFW Coll-WBd Hd to Hd',
      message: null,
      allowMulti: true,
      icon: {
        appIconIdentifier: 'afl_football',
        imageURL: '',
        keepOriginalColor: false,
      },
      onlineBetting: false,
      phoneBettingOnly: true,
      propositions: [
        {
          id: '3777',
          numberId: 3777,
          number: 3777,
          name: 'Collingwood (W)',
          position: 'HOME',
          sortOrder: 1,
          returnWin: 2,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
        {
          id: '3778',
          numberId: 3778,
          number: 3778,
          name: 'Wst Bulldogs (W)',
          position: 'AWAY',
          sortOrder: 2,
          returnWin: 1.8,
          returnPlace: 0,
          bettingStatus: 'Open',
          isOpen: true,
          allowPlace: false,
        },
      ],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'AFL Football',
          competitionName: 'AFL Womens',
          matchName: 'Collingwood (W) v Wst Bulldogs (W)',
        },
      },
    },
  ]);
};

const assertInfoUpcomingData = (response) => {
  response.should.eql([
    {
      type: 'sports.propositions.empty',
      title: 'Querrey v Herbert P',
      subTitle: 'ATP Hertogenbosch',
      matchId: 'QuryvHrbP',
      inPlay: false,
      goingInPlay: false,
      startTime: '2022-06-05T09:08:41.000Z',
      displayTime: '2022-06-05T09:08:41.000Z',
      hasVision: false,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'tennis',
        imageURL: '',
        keepOriginalColor: false,
      },
      propositions: [],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:tournament-match:page',
        params: {
          sportName: 'Tennis',
          competitionName: 'ATP',
          tournamentName: 'ATP Hertogenbosch',
          matchName: 'Querrey v Herbert P',
        },
      },
    },
    {
      type: 'sports.propositions.empty',
      title: 'Bandecchi v Loeb',
      subTitle: 'WTA Hertogenbosch',
      matchId: 'BndcvLoeb',
      inPlay: false,
      goingInPlay: false,
      startTime: '2022-06-05T10:50:06.000Z',
      displayTime: '2022-06-05T10:50:06.000Z',
      hasVision: false,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'tennis',
        imageURL: '',
        keepOriginalColor: false,
      },
      propositions: [],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:tournament-match:page',
        params: {
          sportName: 'Tennis',
          competitionName: 'WTA',
          tournamentName: 'WTA Hertogenbosch',
          matchName: 'Bandecchi v Loeb',
        },
      },
    },
    {
      type: 'sports.propositions.empty',
      title: 'Gadecki O v Fruhvirtova L',
      subTitle: 'WTA Hertogenbosch',
      matchId: 'GdcOvFrhL',
      inPlay: false,
      goingInPlay: false,
      startTime: '2022-06-05T10:50:15.000Z',
      displayTime: '2022-06-05T10:50:15.000Z',
      hasVision: false,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'tennis',
        imageURL: '',
        keepOriginalColor: false,
      },
      propositions: [],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:tournament-match:page',
        params: {
          sportName: 'Tennis',
          competitionName: 'WTA',
          tournamentName: 'WTA Hertogenbosch',
          matchName: 'Gadecki O v Fruhvirtova L',
        },
      },
    },
    {
      type: 'sports.propositions.empty',
      title: 'Chicago Cubs v St Louis',
      subTitle: 'Major League Baseball',
      matchId: 'CCubvStLs4',
      inPlay: false,
      goingInPlay: false,
      startTime: '2022-06-05T23:08:00.000Z',
      displayTime: '2022-06-05T23:08:00.000Z',
      hasVision: true,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'baseball',
        imageURL: '',
        keepOriginalColor: false,
      },
      propositions: [],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Baseball',
          competitionName: 'Major League Baseball',
          matchName: 'Chicago Cubs v St Louis',
        },
      },
    },
    {
      type: 'sports.propositions.empty',
      title: 'Golden State v Boston',
      subTitle: 'NBA',
      matchId: 'GSWvBos0',
      inPlay: false,
      goingInPlay: false,
      startTime: '2022-06-06T00:00:00.000Z',
      displayTime: '2022-06-06T00:00:00.000Z',
      hasVision: true,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'basketball',
        imageURL: '',
        keepOriginalColor: false,
      },
      propositions: [],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Basketball',
          competitionName: 'NBA',
          matchName: 'Golden State v Boston',
        },
      },
    },
    {
      type: 'sports.propositions.empty',
      title: 'Deportes Tolima v La Equidad',
      subTitle: 'Colombia Primera A',
      matchId: 'DTlmvLEqd',
      inPlay: false,
      goingInPlay: false,
      startTime: '2022-06-06T00:35:00.000Z',
      displayTime: '2022-06-06T00:35:00.000Z',
      hasVision: true,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'soccer',
        imageURL: '',
        keepOriginalColor: false,
      },
      propositions: [],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Soccer',
          competitionName: 'Colombia Primera A',
          matchName: 'Deportes Tolima v La Equidad',
        },
      },
    },
    {
      type: 'sports.propositions.empty',
      title: 'Soccer Tuesday Offer',
      subTitle: 'Sports Offers',
      matchId: '1SPO0706',
      inPlay: false,
      goingInPlay: false,
      startTime: '2022-06-06T18:45:00.000Z',
      displayTime: '2022-06-06T18:45:00.000Z',
      hasVision: false,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'todays_offers',
        imageURL: '',
        keepOriginalColor: false,
      },
      propositions: [],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Todays Offers',
          competitionName: 'Sports Offers',
          matchName: 'Soccer Tuesday Offer',
        },
      },
    },
    {
      type: 'sports.propositions.empty',
      title: 'MLB Tuesday Offer 1',
      subTitle: 'Sports Offers',
      matchId: '3SPO0706',
      inPlay: false,
      goingInPlay: false,
      startTime: '2022-06-07T00:10:00.000Z',
      displayTime: '2022-06-07T00:10:00.000Z',
      hasVision: false,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'todays_offers',
        imageURL: '',
        keepOriginalColor: false,
      },
      propositions: [],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Todays Offers',
          competitionName: 'Sports Offers',
          matchName: 'MLB Tuesday Offer 1',
        },
      },
    },
    {
      type: 'sports.propositions.empty',
      title: 'MLB Tuesday Offer',
      subTitle: 'Sports Offers',
      matchId: '2SPO0706',
      inPlay: false,
      goingInPlay: false,
      startTime: '2022-06-07T01:40:00.000Z',
      displayTime: '2022-06-07T01:40:00.000Z',
      hasVision: false,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'todays_offers',
        imageURL: '',
        keepOriginalColor: false,
      },
      propositions: [],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Todays Offers',
          competitionName: 'Sports Offers',
          matchName: 'MLB Tuesday Offer',
        },
      },
    },
    {
      type: 'sports.propositions.empty',
      title: 'Cricket Tuesday Offer',
      subTitle: 'Sports Offers',
      matchId: '4SPO0706',
      inPlay: false,
      goingInPlay: false,
      startTime: '2022-06-07T13:30:00.000Z',
      displayTime: '2022-06-07T13:30:00.000Z',
      hasVision: false,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'todays_offers',
        imageURL: '',
        keepOriginalColor: false,
      },
      propositions: [],
      navigation: {
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
        params: {
          sportName: 'Todays Offers',
          competitionName: 'Sports Offers',
          matchName: 'Cricket Tuesday Offer',
        },
      },
    },
  ]);
};

describe('Home controller', () => {
  const res = {
    json: (args) => args,
    status: (args) => args,
  };
  const cfg = config.get();

  const req = {
    query: {
      jurisdiction: 'NSW',
      homeState: 'sa',
      platform: 'mobile',
      os: 'ios',
      version: '1.0',
    },
  };
  const next = () => { };
  let response;

  let clock;
  // let fakeNow = new Date(2021, 4, 20, 7);
  // let fakeNow = 1621458000000;

  const fakeNow = (new Date('2022-02-24T09:00:00.000Z')).getTime();

  beforeEach(() => {
    sinon.stub(config, 'get');
    sinon.stub(config, 'getDynamicConfig');

    sinon.stub(log.transaction, 'info');

    sinon.stub(requestCache, 'fetchAem');
    sinon.stub(requestCache, 'fetchInfo');
    sinon.stub(requestCache, 'fetchRecommendation');

    clock = sinon.stub(Date, 'now').returns(fakeNow);
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
  });

  describe('Page endpoint', () => {
    describe('When Quicklink carousel, In-play and results should be displayed', () => {
      beforeEach(async () => {
        sinon.useFakeTimers(Date.parse('2022-11-24T15:00:00.000Z'));
        requestCache.fetchInfo.withArgs('info:sports').resolves({ sports: sportsInfoWithMatchDetails });
        requestCache.fetchAem.withArgs('sport').resolves(aemSportData);
        requestCache.fetchAem.withArgs('promo').resolves(aemSportPromoData);
        config.getDynamicConfig.returns({
          ...cfg.dynamicConfig,
          toggles: {
            enableQuicklinkCarousel: true,
            enableHomeInplay: true,
            enableHomeResults: true,
          },
        });
        response = await homeCtrl.page(req, res, next);
      });

      it('has type as sports.home', () => {
        response.type.should.eql('sports.home');
      });

      it('should have data.length 2', () => {
        response.data.length.should.eql(2);
      });

      it('should return landing page icon carousel', () => {
        response.data[0].type.should.eql('sports.carousel.icon');
        response.data[0].data.should.eql([
          {
            title: 'Racing Multi Builder',
            dataUrl: 'https://congo.beta.tab.com.au/racing/more/Box%20Challenge',
            icon: {
              appIconIdentifier: 'racing',
              imageURL: '',
              keepOriginalColor: false,
            },
          },
          {
            title: 'Todays Racing',
            dataUrl: '/racing/meetings/today/R',
            icon: {
              appIconIdentifier: 'racing',
              imageURL: '',
              keepOriginalColor: false,
            },
          },
          {
            title: 'Todays Greyhounds',
            dataUrl: '/racing/meetings/today/G',
            icon: {
              appIconIdentifier: 'greyhound',
              imageURL: '',
              keepOriginalColor: false,
            },
          },
          {
            title: 'Soccer Euros Tipping - NSW',
            dataUrl: '/competitions/tipping/public',
            icon: {
              appIconIdentifier: 'soccer',
              imageURL: '',
              keepOriginalColor: false,
            },
          },
          {
            title: 'Melbourne Cup',
            dataUrl: 'tab.com.au/racing/flemington',
            icon: {
              appIconIdentifier: 'swimming',
              imageURL: '',
              keepOriginalColor: false,
            },
          },
          {
            title: 'State Of Origin - NSW',
            dataUrl: '/sports/betting/Rugby%20League/competitions/State%20of%20Origin',
            icon: {
              appIconIdentifier: 'rugby-league',
              imageURL: '',
              keepOriginalColor: false,
            },
          },
          {
            title: 'State Of Origin',
            dataUrl: '/sports/betting/Rugby%20League/competitions/State%20of%20Origin',
            icon: {
              appIconIdentifier: 'rugby-league',
              imageURL: '',
              keepOriginalColor: false,
            },
          },
          {
            title: 'Jackpots',
            dataUrl: '/racing/jackpots',
            icon: {
              appIconIdentifier: 'todays-specials',
              imageURL: '',
              keepOriginalColor: false,
            },
          },
          {
            title: 'EPL',
            dataUrl: '/sports/betting/Soccer/competitions/English%20Premier%20League',
            icon: {
              appIconIdentifier: 'soccer',
              imageURL: '',
              keepOriginalColor: false,
            },
          },
          {
            title: 'NRL',
            dataUrl: '/sports/betting/Rugby%20League/competitions/NRL',
            icon: {
              appIconIdentifier: 'rugby-league',
              imageURL: '',
              keepOriginalColor: false,
            },
          },
          {
            title: 'AFL',
            dataUrl: '/sports/betting/AFL%20Football/competitions/AFL',
            icon: {
              appIconIdentifier: 'swimming',
              imageURL: '',
              keepOriginalColor: false,
            },
          },
          {
            title: 'Test-NSW',
            dataUrl: 'https://www.tabinfo.com.au/EurosTipping/',
            icon: {
              appIconIdentifier: 'todays-specials',
              imageURL: '',
              keepOriginalColor: false,
            },
          },
        ]);
      });

      it('should return landing page text carousel', () => {
        response.data[1].type.should.eql('sports.carousel.text');
      });

      it('should return landing page text carousel with data.length 4', () => {
        response.data[1].data.length.should.eql(4);
        response.data[1].data[1].should.eql({
          active: false,
          title: 'Upcoming',
          tab: 'upcoming',
          discoveryKey: 'bff:sports:upcoming',
        });
        response.data[1].data[2].should.eql({
          active: false,
          title: 'In-Play',
          tab: 'inPlay',
          discoveryKey: 'bff:sports:in-play',
        });
        response.data[1].data[3].should.eql({
          active: false,
          title: 'Results',
          tab: 'results',
          discoveryKey: 'bff:sports:results',
        });
      });

      it('should return landing page sports data', () => {
        assertSportsData(JSON.parse(JSON.stringify(response.data[1].data[0])));
      });
    });

    describe('When Quicklink carousel, In-play and results should not be displayed', () => {
      beforeEach(async () => {
        sinon.useFakeTimers(Date.parse('2022-11-24T15:00:00.000Z'));
        requestCache.fetchInfo.withArgs('info:sports').resolves({ sports: sportsInfoWithMatchDetails });
        requestCache.fetchAem.withArgs('promo').resolves(aemSportPromoData);
        config.getDynamicConfig.returns({
          ...cfg.dynamicConfig,
          toggles: {
            enableQuicklinkCarousel: false,
            enableHomeInplay: false,
            enableHomeResults: false,
          },
        });
        response = await homeCtrl.page(req, res, next);
      });

      it('has type as sports.home', () => {
        response.type.should.eql('sports.home');
      });

      it('should have data.length 1', () => {
        response.data.length.should.eql(1);
      });

      it('should return landing page text carousel', () => {
        response.data[0].type.should.eql('sports.carousel.text');
      });

      it('should return landing page text carousel with data.length 2', () => {
        response.data[0].data.length.should.eql(2);
        response.data[0].data[1].should.eql({
          active: false,
          title: 'Upcoming',
          tab: 'upcoming',
          discoveryKey: 'bff:sports:upcoming',
        });
      });

      it('should return landing page sports data', () => {
        assertSportsData(JSON.parse(JSON.stringify(response.data[0].data[0])));
      });
    });
  });

  describe('Sports endpoint', () => {
    beforeEach(() => {
      sinon.useFakeTimers(Date.parse('2022-11-24T15:00:00.000Z'));
      requestCache.fetchAem.withArgs('promo').resolves(aemSportPromoData);
    });
    it('should return sports data', async () => {
      config.getDynamicConfig.returns(cfg.dynamicConfig);
      requestCache.fetchInfo.withArgs('info:sports').resolves({ sports: sportsInfoWithMatchDetails });
      response = await homeCtrl.sports(req, res, next);
      response.type.should.eql('sports.home.tab');
      response.discoveryKey.should.eql('bff:sports:all');
      response.data.length.should.eql(2);
      assertSportsData(JSON.parse(JSON.stringify(response)));
    });
  });

  describe('Results endpoint', () => {
    it('should return sports results data', async () => {
      config.getDynamicConfig.returns(cfg.dynamicConfig);
      requestCache.fetchInfo.withArgs('info:sports:results').resolves({ sports: sportsInfo });
      response = await homeCtrl.results(req, res, next);
      response.type.should.eql('sports.home.results');
      response.discoveryKey.should.eql('bff:sports:results');
      response.data.length.should.eql(8);
      assertResultsData(JSON.parse(JSON.stringify(response)));
    });
  });

  describe('Upcoming endpoint', () => {
    describe('if using recommendation service for upcoming', () => {
      beforeEach(() => {
        requestCache.fetchAem.withArgs('promo').resolves(aemSportPromoData);
        config.getDynamicConfig.returns({
          ...cfg.dynamicConfig,
          toggles: {
            useInfoNextToGo: false,
          },
        });
      });
      it('should return tabs for all individual sports with upcoming matches', async () => {
        requestCache.fetchRecommendation.withArgs('recommendation:sports-next-to-go').resolves(n2g);
        response = await homeCtrl.upcoming(req, res, next);
        response.type.should.eql('sports.home.upcoming');
        response.discoveryKey.should.eql('bff:sports:upcoming');
        response.data.length.should.eql(1);
        response.data[0].type.should.eql('sports.home.upcoming.chips');
        response.data[0].data.length.should.eql(3);
        response.data[0].data[0].title.should.eql('All Sports');
        response.data[0].data[1].title.should.eql('Basketball');
        response.data[0].data[2].title.should.eql('Tennis');
        response.data[0].data[1].sportName.should.eql('Basketball');
        response.data[0].data[2].sportName.should.eql('Tennis');
        response.data[0].data[1].filter.should.eql({ key: 'sportName', value: 'Basketball' });
        response.data[0].data[2].filter.should.eql({ key: 'sportName', value: 'Tennis' });
        response.data[0].data[1].discoveryKey.should.eql('bff:sports:sport:upcoming');
        response.data[0].data[2].discoveryKey.should.eql('bff:sports:sport:upcoming');
      });
      it('should return upcoming matches data', async () => {
        sinon.useFakeTimers(Date.parse('2022-11-24T15:00:00.000Z'));
        requestCache.fetchRecommendation.withArgs('recommendation:sports-next-to-go').resolves(n2g1);
        response = await homeCtrl.upcoming(req, res, next);
        response.type.should.eql('sports.home.upcoming');
        response.discoveryKey.should.eql('bff:sports:upcoming');
        response.data.length.should.eql(1);
        assertUpcomingData(JSON.parse(JSON.stringify(response.data[0].data[0].data)));
      });
      it('should not return All Sports chip in case of a single upcoming sport', async () => {
        requestCache.fetchRecommendation.withArgs('recommendation:sports-next-to-go').resolves(ntgSingleSport);
        response = await homeCtrl.upcoming(req, res, next);
        response.type.should.eql('sports.home.upcoming');
        response.discoveryKey.should.eql('bff:sports:upcoming');
        response.data[0].type.should.eql('sports.home.upcoming.chips');
        response.data.length.should.eql(1);
        response.data[0].data.length.should.eql(1);
        response.data[0].data[0].title.should.eql('');
      });
      it('should not return sports with future matches', async () => {
        sinon.useFakeTimers(Date.parse('2022-02-24T15:00:00.000Z'));
        requestCache.fetchRecommendation.withArgs('recommendation:sports-next-to-go').resolves(n2g);
        response = await homeCtrl.upcoming(req, res, next);
        response.data.length.should.eql(1);
        response.data[0].data.length.should.eql(3);
        response.data[0].data[0].title.should.eql('All Sports');
        response.data[0].data[1].title.should.eql('Basketball');
        response.data[0].data[2].title.should.eql('Tennis');
      });

      describe('BetType toggle', () => {
        it('Should show no markets if BetTypes toggle is empty ([])', async () => {
          config.getDynamicConfig.returns({
            ...cfg.dynamicConfig,
            toggles: {
              useInfoNextToGo: false,
            },
            displayBetTypes: [],
          });
          requestCache.fetchRecommendation.withArgs('recommendation:sports-next-to-go').resolves(ntgSingleSport);
          response = await homeCtrl.upcoming(req, res, next);
          response.type.should.eql('sports.home.upcoming');
          response.discoveryKey.should.eql('bff:sports:upcoming');
          response.data.length.should.eql(1);
          const timeGroups = response.data[0].data[0].data[0];
          timeGroups.data[0].type.should.eql('sports.propositions.empty');
          should.not.exist(timeGroups.data[0].betOption);
        });
        it('Should show first market if BetTypes toggle is set to "ALL"', async () => {
          config.getDynamicConfig.returns({
            ...cfg.dynamicConfig,
            toggles: {
              useInfoNextToGo: false,
            },
            displayBetTypes: ['all'],
          });
          requestCache.fetchRecommendation.withArgs('recommendation:sports-next-to-go').resolves(ntgSingleSport);
          response = await homeCtrl.upcoming(req, res, next);
          response.type.should.eql('sports.home.upcoming');
          response.discoveryKey.should.eql('bff:sports:upcoming');
          response.data.length.should.eql(1);
          const timeGroups = response.data[0].data[0].data[0];
          timeGroups.data[0].type.should.eql('sports.propositions.horizontal');
          timeGroups.data[0].betOption.should.eql('Head To Head');
        });
        it('Should show first matching market if BetTypes toggle is set to specific market(s)', async () => {
          config.getDynamicConfig.returns({
            ...cfg.dynamicConfig,
            toggles: {
              useInfoNextToGo: false,
            },
            displayBetTypes: ['line', 'margin'],
          });
          requestCache.fetchRecommendation.withArgs('recommendation:sports-next-to-go').resolves(ntgSingleSport);
          response = await homeCtrl.upcoming(req, res, next);
          response.type.should.eql('sports.home.upcoming');
          response.discoveryKey.should.eql('bff:sports:upcoming');
          const timeGroups = response.data[0].data[0].data[0];
          timeGroups.data[0].type.should.eql('sports.propositions.vertical');
          timeGroups.data[0].betOption.should.eql('Line');
        });
      });
    });

    describe('if using info service for upcoming', () => {
      beforeEach(async () => {
        config.getDynamicConfig.returns({
          ...cfg.dynamicConfig,
          toggles: {
            useInfoNextToGo: true,
          },
        });
        requestCache.fetchInfo.withArgs('info:sports:nextToGo').resolves(infoUpcoming);
        response = await homeCtrl.upcoming(req, res, next);
      });
      it('should return tabs for all individual sports with upcoming matches', async () => {
        response.type.should.eql('sports.home.upcoming');
        response.data.length.should.eql(1);
        response.discoveryKey.should.eql('bff:sports:upcoming');
        response.refreshRate.should.eql(30);
        response.data[0].type.should.eql('sports.home.upcoming.chips');
        response.data[0].data.length.should.eql(6);
        response.data[0].data[0].title.should.eql('All Sports');
        response.data[0].data[0].data[0].type.should.eql('app.sports.timeGroups');
        response.data[0].data[0].data[0].groups.length.should.eql(3);
        response.data[0].data[0].data[0].data.length.should.eql(10);
        assertInfoUpcomingData(JSON.parse(JSON.stringify(response.data[0].data[0].data[0].data)));
        response.data[0].data[1].sportName.should.eql('Baseball');
        response.data[0].data[2].sportName.should.eql('Basketball');
        response.data[0].data[3].sportName.should.eql('Soccer');
        response.data[0].data[4].sportName.should.eql('Tennis');
        response.data[0].data[5].sportName.should.eql('Todays Offers');
      });
    });
  });

  describe('InPlay endpoint', () => {
    beforeEach(() => {
      sinon.useFakeTimers(Date.parse('2022-11-24T15:00:00.000Z'));
      requestCache.fetchAem.withArgs('promo').resolves(aemSportPromoData);
      config.get.returns(cfg);
      config.getDynamicConfig.returns(cfg.dynamicConfig);
    });

    it('should return tabs for all individual sports with inPlay matches', async () => {
      requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEvents);
      response = await homeCtrl.inPlay(req, res, next);
      response.type.should.eql('sports.home.inplay');
      response.discoveryKey.should.eql('bff:sports:in-play');
      response.data.length.should.eql(1);
      response.data[0].type.should.eql('sports.home.inplay.chips');
      response.data[0].data.length.should.eql(7);
      response.data[0].data[0].title.should.eql('All Sports');
      response.data[0].data[0].defaultOddsCount.should.eql(4);
      response.data[0].data[0].oddsCountBuffer.should.eql(1);
      response.data[0].data[1].title.should.eql('AFL');
      response.data[0].data[2].title.should.eql('Basketball');
      response.data[0].data[3].title.should.eql('Cricket');
      response.data[0].data[4].title.should.eql('Ice Hockey');
      response.data[0].data[5].title.should.eql('Soccer');
      response.data[0].data[6].title.should.eql('Tennis');
      response.data[0].data[1].sportName.should.eql('AFL Football');
      response.data[0].data[2].sportName.should.eql('Basketball');
      response.data[0].data[3].sportName.should.eql('Cricket');
      response.data[0].data[4].sportName.should.eql('Ice Hockey');
      response.data[0].data[5].sportName.should.eql('Soccer');
      response.data[0].data[6].sportName.should.eql('Tennis');
      response.data[0].data[1].filter.should.eql({ key: 'sportName', value: 'AFL Football' });
      response.data[0].data[2].filter.should.eql({ key: 'sportName', value: 'Basketball' });
      response.data[0].data[3].filter.should.eql({ key: 'sportName', value: 'Cricket' });
      response.data[0].data[4].filter.should.eql({ key: 'sportName', value: 'Ice Hockey' });
      response.data[0].data[5].filter.should.eql({ key: 'sportName', value: 'Soccer' });
      response.data[0].data[6].filter.should.eql({ key: 'sportName', value: 'Tennis' });
      response.data[0].data[1].discoveryKey.should.eql('bff:sports:sport:in-play');
      response.data[0].data[2].discoveryKey.should.eql('bff:sports:sport:in-play');
      response.data[0].data[3].discoveryKey.should.eql('bff:sports:sport:in-play');
    });

    it('should return inPlay matches data', async () => {
      requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEvents);
      response = await homeCtrl.inPlay(req, res, next);
      response.type.should.eql('sports.home.inplay');
      response.discoveryKey.should.eql('bff:sports:in-play');
      response.data.length.should.eql(1);
      assertInPlayData(JSON.parse(JSON.stringify(response.data[0].data[0].data)));
    });

    it('should not return All Sports chip in case of a single in-play sport', async () => {
      requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEventSingleSport);
      response = await homeCtrl.inPlay(req, res, next);
      response.type.should.eql('sports.home.inplay');
      response.discoveryKey.should.eql('bff:sports:in-play');
      response.data.length.should.eql(1);
      response.data[0].type.should.eql('sports.home.inplay.chips');
      response.data[0].data.length.should.eql(1);
      response.data[0].data[0].title.should.eql('');
    });

    describe('BetType toggle', () => {
      it('Should show no markets if BetTypes toggle is empty ([])', async () => {
        config.getDynamicConfig.returns({
          ...cfg.dynamicConfig,
          displayBetTypes: [],
        });
        requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEventSingleSport);
        response = await homeCtrl.inPlay(req, res, next);
        response.type.should.eql('sports.home.inplay');
        response.discoveryKey.should.eql('bff:sports:in-play');
        response.data.length.should.eql(1);
        response.data[0].data[0].data[0].type.should.eql('sports.propositions.empty');
      });
      it('Should show first market if BetTypes toggle is set to "ALL"', async () => {
        config.getDynamicConfig.returns({
          ...cfg.dynamicConfig,
          displayBetTypes: ['all'],
        });
        requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEventSingleSport);
        response = await homeCtrl.inPlay(req, res, next);
        response.type.should.eql('sports.home.inplay');
        response.discoveryKey.should.eql('bff:sports:in-play');
        response.data.length.should.eql(1);
        response.data[0].data[0].data[0].type.should.eql('sports.propositions.horizontal');
        response.data[0].data[0].data[0].betOption.should.eql('Head To Head');
      });
      it('Should show first matching market if BetTypes toggle is set to specific market(s)', async () => {
        config.getDynamicConfig.returns({
          ...cfg.dynamicConfig,
          displayBetTypes: ['margin', 'line'],
        });
        requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEventSingleSport);
        response = await homeCtrl.inPlay(req, res, next);
        response.type.should.eql('sports.home.inplay');
        response.discoveryKey.should.eql('bff:sports:in-play');
        response.data.length.should.eql(1);
        response.data[0].data[0].data[0].type.should.eql('sports.propositions.vertical');
        response.data[0].data[0].data[0].betOption.should.eql('Margin');
      });
    });
  });
});
