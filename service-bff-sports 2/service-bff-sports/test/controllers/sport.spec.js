const should = require('should');
const sinon = require('sinon');

const allBaseball = require('../expected-data/sport-featured/all-baseball');
const baseballFeatured = require('../expected-data/sport-featured/baseball-featured');
const aemSportPromoData = require('../mocks/aem/sport.promo.visbility.json');
const infoUpcoming = require('../mocks/info-wift/next-to-go.json');
const { volleyball } = require('../mocks/info-wift/results');
const { cycling, tennis, rugbyLeague } = require('../mocks/info-wift/sport');
const baseball = require('../mocks/recomm-service/featured/baseball.json');
const { liveEvents, liveEventSingleSport } = require('../mocks/recomm-service/live-events');
const { ntgSingleSport, n2g1 } = require('../mocks/recomm-service/n2g');

const config = require(`${global.SRC}/config`);
const sportCtrl = require(`${global.SRC}/controllers/sport`);
const log = require(`${global.SRC}/log`);
const requestCache = require(`${global.SRC}/request-cache`);

const competitionsWithMatchInfo = cycling;
const competitionsWithTournInfo = tennis;
const competitionsWithSingleMatch = rugbyLeague;
const resultsInfo = volleyball;

const assertFeaturedData = (resData) => {
  resData.title.should.eql('Featured');
  resData.tab.should.eql('featured');
  resData.active.should.eql(true);
  resData.discoveryKey.should.eql('bff:sports:sport:featured');
  resData.data.should.eql(baseballFeatured);
};

const assertCompetitionsData = (resData) => {
  resData.discoveryKey.should.eql('bff:sports:sport:all');
  resData.data.should.eql([
    {
      displayName: 'Tour of Oman',
      spectrumId: '1982',
      sameGame: false,
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'Tour of Oman',
          matchName: 'CYCLING MATCH - C1T1M30',
        },
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
      },
    },
    {
      displayName: 'Milan-San Remo',
      spectrumId: '1874',
      sameGame: false,
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'Milan-San Remo',
          matchName: 'CYCLING MATCH - C1T1M08',
        },
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:match:page',
      },
    },
    {
      displayName: 'Giro d Italia',
      spectrumId: '1825',
      sameGame: false,
      promoAvailable: false,
      navigation: {
        params: { sportName: 'Basketball', competitionName: 'Giro d Italia' },
        template: 'screen:sport:competition',
        discoveryKey: 'bff:sports:competition',
      },
    },
    {
      displayName: 'Tour de France',
      spectrumId: '1802',
      sameGame: false,
      promoAvailable: false,
      navigation: {
        params: { sportName: 'Basketball', competitionName: 'Tour de France' },
        template: 'screen:sport:competition',
        discoveryKey: 'bff:sports:competition',
      },
    },
  ]);
};

const assertCompetitionsAndTournData = (resData) => {
  resData.discoveryKey.should.eql('bff:sports:sport:all');
  resData.data.should.eql([
    {
      displayName: 'ATP Montpellier',
      spectrumId: '302040',
      sameGame: false,
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'ATP',
          tournamentName: 'ATP Montpellier',
          matchName: 'Gaston v Moutet',
        },
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:tournament-match:page',
      },
    },
    {
      displayName: 'ATP Pune',
      spectrumId: '302204',
      sameGame: false,
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'ATP',
          tournamentName: 'ATP Pune',
        },
        template: 'screen:sport:tournament',
        discoveryKey: 'bff:sports:tournament',
      },
    },
    {
      displayName: 'ATP Cordoba Doubles',
      spectrumId: '3255003',
      sameGame: false,
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'ATP Doubles',
          tournamentName: 'ATP Cordoba Doubles',
        },
        template: 'screen:sport:tournament',
        discoveryKey: 'bff:sports:tournament',
      },
    },
    {
      displayName: 'ATP Montpellier Doubles',
      spectrumId: '3255001',
      sameGame: false,
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'ATP Doubles',
          tournamentName: 'ATP Montpellier Doubles',
        },
        template: 'screen:sport:tournament',
        discoveryKey: 'bff:sports:tournament',
      },
    },
    {
      displayName: 'ATP Montpellier Futures',
      spectrumId: '3263005',
      sameGame: false,
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'ATP Futures',
          tournamentName: 'ATP Montpellier Futures',
          matchName: 'Gaston v Moutet',
        },
        template: 'screen:sport:match',
        discoveryKey: 'bff:sports:tournament-match:page',
      },
    },
  ]);
};

const assertResultsData = (resData) => {
  resData.should.eql([
    {
      displayName: 'South Korea V League Women',
      spectrumId: '2742',
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'South Korea V League Women',
        },
        template: 'screen:sport:competition:result',
        discoveryKey: 'bff:sports:competition:results',
      },
    },
    {
      displayName: 'Austria Herren Volley League',
      spectrumId: '2623',
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'Austria Herren Volley League',
        },
        template: 'screen:sport:competition:result',
        discoveryKey: 'bff:sports:competition:results',
      },
    },
    {
      displayName: 'Champions League Men',
      spectrumId: '2637',
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'Champions League Men',
        },
        template: 'screen:sport:competition:result',
        discoveryKey: 'bff:sports:competition:results',
      },
    },
    {
      displayName: 'CEV Cup',
      spectrumId: '2634',
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'CEV Cup',
        },
        template: 'screen:sport:competition:result',
        discoveryKey: 'bff:sports:competition:results',
      },
    },
    {
      displayName: 'Brazil Superliga Women',
      spectrumId: '2628',
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'Brazil Superliga Women',
        },
        template: 'screen:sport:competition:result',
        discoveryKey: 'bff:sports:competition:results',
      },
    },
    {
      displayName: 'France Ligue A',
      spectrumId: '2659',
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'France Ligue A',
        },
        template: 'screen:sport:competition:result',
        discoveryKey: 'bff:sports:competition:results',
      },
    },
    {
      displayName: 'Netherlands A League',
      spectrumId: '2692',
      promoAvailable: false,
      navigation: {
        params: {
          sportName: 'Basketball',
          competitionName: 'Netherlands A League',
        },
        template: 'screen:sport:competition:result',
        discoveryKey: 'bff:sports:competition:results',
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
  resData.should.eql([{
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
    icon: { appIconIdentifier: 'basketball', imageURL: '', keepOriginalColor: false },
    onlineBetting: false,
    phoneBettingOnly: true,
    propositions: [{
      id: '576043', numberId: 576043, number: 576043, name: 'Milwaukee', position: 'HOME', sortOrder: 1, returnWin: 7.5, returnPlace: 0, bettingStatus: 'Suspended', isOpen: false, allowPlace: false, icon: { imageURL: 'https://metadata.beta.tab.com.au/icons/NBA%20logos/Milwaukee%20Bucks.svg' },
    }, {
      id: '576044', numberId: 576044, number: 576044, name: 'Brooklyn', position: 'AWAY', sortOrder: 2, returnWin: 1.08, returnPlace: 0, bettingStatus: 'Suspended', isOpen: false, allowPlace: false, icon: { imageURL: 'https://metadata.beta.tab.com.au/icons/NBA%20logos/Brooklyn%20Nets.svg' },
    }],
    navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NBA', matchName: 'Milwaukee v Brooklyn' } },
  }, {
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
    icon: { appIconIdentifier: 'basketball', imageURL: '', keepOriginalColor: false },
    onlineBetting: false,
    phoneBettingOnly: true,
    propositions: [{
      id: '576045', numberId: 576045, number: 576045, name: 'Denver', position: 'HOME', sortOrder: 1, returnWin: 1.28, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false, icon: { imageURL: 'https://metadata.beta.tab.com.au/icons/NBA%20logos/Denver%20Nuggets.svg' },
    }, {
      id: '576046', numberId: 576046, number: 576046, name: 'Sacramento', position: 'AWAY', sortOrder: 2, returnWin: 3.6, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false, icon: { imageURL: 'https://metadata.beta.tab.com.au/icons/NBA%20logos/Sacramento%20Kings.svg' },
    }],
    navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NBA', matchName: 'Denver v Sacramento' } },
  }, {
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
    icon: { appIconIdentifier: 'basketball', imageURL: '', keepOriginalColor: false },
    onlineBetting: false,
    phoneBettingOnly: true,
    propositions: [{
      id: '625107', numberId: 625107, number: 625107, name: 'Oregon', position: 'HOME', sortOrder: 1, returnWin: 1.5, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false,
    }, {
      id: '625108', numberId: 625108, number: 625108, name: 'USC', position: 'AWAY', sortOrder: 2, returnWin: 2.4, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false,
    }],
    navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NCAA Basketball', matchName: 'Oregon v USC' } },
  }, {
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
    icon: { appIconIdentifier: 'basketball', imageURL: '', keepOriginalColor: false },
    onlineBetting: false,
    phoneBettingOnly: true,
    propositions: [{
      id: '625159', numberId: 625159, number: 625159, name: 'Saint Marys', position: 'HOME', sortOrder: 1, returnWin: 1.2, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false,
    }, {
      id: '625160', numberId: 625160, number: 625160, name: 'Gonzaga', position: 'AWAY', sortOrder: 2, returnWin: 4, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false,
    }],
    navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NCAA Basketball', matchName: 'Saint Marys v Gonzaga' } },
  }, {
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
    icon: { appIconIdentifier: 'basketball', imageURL: '', keepOriginalColor: false },
    onlineBetting: false,
    phoneBettingOnly: true,
    propositions: [{
      id: '625694', numberId: 625694, number: 625694, name: 'Utah', position: 'HOME', sortOrder: 1, returnWin: 3.8, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false,
    }, {
      id: '625695', numberId: 625695, number: 625695, name: 'Arizona State', position: 'AWAY', sortOrder: 2, returnWin: 1.22, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false,
    }],
    navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NCAA Basketball', matchName: 'Utah v Arizona State' } },
  }, {
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
    icon: { appIconIdentifier: 'basketball', imageURL: '', keepOriginalColor: false },
    onlineBetting: false,
    phoneBettingOnly: true,
    propositions: [{
      id: '630605', numberId: 630605, number: 630605, name: 'UNLV', position: 'HOME', sortOrder: 1, returnWin: 1.9, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false,
    }, {
      id: '630606', numberId: 630606, number: 630606, name: 'Boise State', position: 'AWAY', sortOrder: 2, returnWin: 1.8, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false,
    }],
    navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NCAA Basketball', matchName: 'UNLV v Boise State' } },
  }, {
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
    icon: { appIconIdentifier: 'basketball', imageURL: '', keepOriginalColor: false },
    onlineBetting: false,
    phoneBettingOnly: true,
    propositions: [{
      id: '634049', numberId: 634049, number: 634049, name: 'Portland State', position: 'HOME', sortOrder: 1, returnWin: 2.25, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false,
    }, {
      id: '634050', numberId: 634050, number: 634050, name: 'Idaho State', position: 'AWAY', sortOrder: 2, returnWin: 1.58, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false,
    }],
    navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NCAA Basketball', matchName: 'Portland State v Idaho State' } },
  }, {
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
    icon: { appIconIdentifier: 'basketball', imageURL: '', keepOriginalColor: false },
    onlineBetting: false,
    phoneBettingOnly: true,
    propositions: [{
      id: '631504', numberId: 631504, number: 631504, name: 'Cairns', position: 'HOME', sortOrder: 1, returnWin: 3.8, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false, icon: { imageURL: 'https://metadata.beta.tab.com.au/icons/NBL/Cairns%20Taipans.svg' },
    }, {
      id: '631505', numberId: 631505, number: 631505, name: 'Melbourne', position: 'AWAY', sortOrder: 2, returnWin: 1.24, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false, icon: { imageURL: 'https://metadata.beta.tab.com.au/icons/NBL/Melbourne%20United.svg' },
    }],
    navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NBL', matchName: 'Cairns v Melbourne' } },
  }]);
};

const assertInfoUpcomingData = (response) => {
  response.should.eql([{
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
    icon: { appIconIdentifier: 'tennis', imageURL: '', keepOriginalColor: false },
    propositions: [],
    navigation: {
      template: 'screen:sport:match',
      discoveryKey: 'bff:sports:tournament-match:page',
      params: {
        sportName: 'Tennis', competitionName: 'ATP', tournamentName: 'ATP Hertogenbosch', matchName: 'Querrey v Herbert P',
      },
    },
  }, {
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
    icon: { appIconIdentifier: 'tennis', imageURL: '', keepOriginalColor: false },
    propositions: [],
    navigation: {
      template: 'screen:sport:match',
      discoveryKey: 'bff:sports:tournament-match:page',
      params: {
        sportName: 'Tennis', competitionName: 'WTA', tournamentName: 'WTA Hertogenbosch', matchName: 'Bandecchi v Loeb',
      },
    },
  }, {
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
    icon: { appIconIdentifier: 'tennis', imageURL: '', keepOriginalColor: false },
    propositions: [],
    navigation: {
      template: 'screen:sport:match',
      discoveryKey: 'bff:sports:tournament-match:page',
      params: {
        sportName: 'Tennis', competitionName: 'WTA', tournamentName: 'WTA Hertogenbosch', matchName: 'Gadecki O v Fruhvirtova L',
      },
    },
  }]);
};

describe('Sport controller', () => {
  const res = {
    json: (args) => args,
    status: (args) => args,
  };

  const defaultConfig = config.get();

  const req = {
    query: {
      jurisdiction: 'NSW',
      platform: 'mobile',
      os: 'ios',
      version: '1.0',
      homeState: '',
    },
    params: {
      sportName: 'Basketball',
    },
  };
  const next = () => { };
  let response;

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    sinon.stub(requestCache, 'fetchInfo');
    sinon.stub(requestCache, 'fetchAem');
    sinon.stub(requestCache, 'fetchRecommendation');
    sinon.stub(config, 'get');
    sinon.stub(config, 'getDynamicConfig');
    sinon.stub(log.transaction, 'info');

    config.get.returns(defaultConfig);
    config.getDynamicConfig.returns(defaultConfig.dynamicConfig);
  });

  describe('Page endpoint', () => {
    describe('When featured, upcoming and in-play need to be displayed', () => {
      beforeEach(async () => {
        requestCache.fetchRecommendation.withArgs('recommendation:featured-sport').resolves(baseball);
        config.getDynamicConfig.returns({
          ...defaultConfig.dynamicConfig,
          toggles: {
            enableSportUpcoming: true,
            enableSportInplay: true,
            enableSportFeatured: true,
          },
        });
        response = await sportCtrl.page(req, res, next);
      });

      it('should return sport landing page text carousel', async () => {
        response.type.should.eql('sports.sport');
        response.title.should.eql('Baseball');
        response.data.length.should.eql(1);
        response.data[0].type.should.eql('sports.carousel.text');
        response.data[0].data.length.should.eql(4);
        response.data[0].data[1].should.eql({
          title: 'All Baseball',
          tab: 'competitions',
          discoveryKey: 'bff:sports:sport:all',
          active: false,
          refreshRate: 30,
        });
        response.data[0].data[2].should.eql({
          title: 'Upcoming',
          tab: 'upcoming',
          discoveryKey: 'bff:sports:sport:upcoming',
          active: false,
        });
        response.data[0].data[3].should.eql({
          title: 'In-Play',
          tab: 'inPlay',
          discoveryKey: 'bff:sports:sport:in-play',
          active: false,
        });
      });

      it('should return sport landing page featured data', async () => {
        assertFeaturedData(JSON.parse(JSON.stringify(response.data[0].data[0])));
      });
    });
    describe('When featured, upcoming and in-play should not be displayed', () => {
      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:sports:sport').resolves(competitionsWithMatchInfo);
        config.getDynamicConfig.returns({
          ...defaultConfig.dynamicConfig,
          toggles: {
            enableSportUpcoming: false,
            enableSportInplay: false,
            enableSportFeatured: false,
          },
        });
        response = await sportCtrl.page(req, res, next);
      });

      it('should return sport landing page text carousel', async () => {
        response.type.should.eql('sports.sport');
        response.title.should.eql('Cycling');
        response.data.length.should.eql(1);
        response.data[0].type.should.eql('sports.carousel.text');
        response.data[0].data.length.should.eql(1);
      });

      it('should return sport landing page All Sport data', async () => {
        response.data[0].data[0].title.should.eql('All Cycling');
        response.data[0].data[0].tab.should.eql('competitions');
        response.data[0].data[0].active.should.eql(true);
        response.data[0].data[0].refreshRate.should.eql(30);
        assertCompetitionsData(JSON.parse(JSON.stringify(response.data[0].data[0])));
      });
      it('should include match page discovery key for competitions with single match ', async () => {
        requestCache.fetchInfo.withArgs('info:sports:sport').resolves(competitionsWithSingleMatch);
        response = await sportCtrl.page(req, res, next);
        response.data[0].data[0].discoveryKey.should.eql('bff:sports:sport:all');
        response.data[0].data[0].data.some(
          (obj) => obj.navigation.discoveryKey === 'bff:sports:match:page',
        ).should.eql(true);
      });
    });
  });

  describe('Competitions endpoint', () => {
    beforeEach(() => {
      requestCache.fetchInfo.withArgs('info:sports:sport').resolves(competitionsWithMatchInfo);
    });

    it('should return competitions data', async () => {
      response = await sportCtrl.sport(req, res, next);
      assertCompetitionsData(JSON.parse(JSON.stringify(response)));
    });

    it('should return competition with tournaments data', async () => {
      requestCache.fetchInfo.withArgs('info:sports:sport').resolves(competitionsWithTournInfo);
      const response1 = await sportCtrl.sport(req, res, next);
      assertCompetitionsAndTournData(response1);
    });
  });

  describe('Featured endpoint', () => {
    beforeEach(async () => {
      requestCache.fetchRecommendation.withArgs('recommendation:featured-sport').resolves(baseball);
      response = await sportCtrl.featured(req, res, next);
    });
    it('has type "sports.sport.featured"', () => {
      response.type.should.eql('sports.sport.featured');
    });
    it('has discoveryKey "bff:sports:sport:featured"', () => {
      response.discoveryKey.should.eql('bff:sports:sport:featured');
    });

    describe('has data', () => {
      it('with one item', () => {
        response.data.length.should.eql(1);
      });

      it('sports.sport.featured.chips"', () => {
        response.data[0].type.should.eql('sports.sport.featured.chips');
      });

      describe('has data', () => {
        it('with 4 items', () => {
          response.data[0].data.length.should.eql(4);
        });

        describe('with correct values for first tab', () => {
          it('with title "All Baseball"', () => {
            response.data[0].data[0].title.should.eql('All Baseball');
          });
          it('with sportName "Baseball"', () => {
            response.data[0].data[0].sportName.should.eql('Baseball');
          });
          it('with discoveryKey "bff:sports:sport:featured"', () => {
            response.data[0].data[0].discoveryKey.should.eql('bff:sports:sport:featured');
          });

          describe('has data', () => {
            it('with 2 items', () => {
              response.data[0].data[0].data.length.should.eql(2);
            });
            it('has in-play data', () => {
              response.data[0].data[0].data[0].title.should.eql('In-Play');
            });
            it('has time-group data', () => {
              response.data[0].data[0].data[1].type.should.eql('app.sports.timeGroups');
            });
            it('has correct data for All Baseball', () => {
              JSON.parse(JSON.stringify(response.data[0].data[0].data)).should.eql(allBaseball);
            });
          });
        });
        describe('with correct values for second tab', () => {
          it('with title "Major League Baseball"', () => {
            response.data[0].data[1].title.should.eql('Major League Baseball');
          });
          it('with discoveryKey "bff:sports:competition:featured"', () => {
            response.data[0].data[1].discoveryKey.should.eql('bff:sports:competition:featured');
          });
          it('with correct filter data', () => {
            response.data[0].data[1].filter.should.eql({
              key: 'competitionName',
              value: 'Major League Baseball',
            });
          });
        });
        describe('with correct values for third tab', () => {
          it('with title "Japanese Baseball League"', () => {
            response.data[0].data[2].title.should.eql('Japanese Baseball League');
          });
          it('with discoveryKey "bff:sports:competition:featured"', () => {
            response.data[0].data[2].discoveryKey.should.eql('bff:sports:competition:featured');
          });
          it('with correct filter data', () => {
            response.data[0].data[2].filter.should.eql({
              key: 'competitionName',
              value: 'Japanese Baseball League',
            });
          });
        });
        describe('with correct values for fourth tab', () => {
          it('with title "Major League Baseball Futures"', () => {
            response.data[0].data[3].title.should.eql('Major League Baseball Futures');
          });
          it('with discoveryKey "bff:sports:competition:featured"', () => {
            response.data[0].data[3].discoveryKey.should.eql('bff:sports:competition:featured');
          });
          it('with correct filter data', () => {
            response.data[0].data[3].filter.should.eql({
              key: 'competitionName',
              value: 'Major League Baseball Futures',
            });
          });
        });
      });
    });
  });

  describe('Results endpoint', () => {
    it('should return competitions results data', async () => {
      requestCache.fetchInfo.withArgs('info:sport:results').resolves(resultsInfo);
      response = await sportCtrl.results(req, res, next);
      response.type.should.eql('sports.sport.results');
      response.discoveryKey.should.eql('bff:sports:sport:results');
      response.data.length.should.eql(7);
      assertResultsData(JSON.parse(JSON.stringify(response.data)));
    });
  });

  describe('Upcoming endpoint', () => {
    describe('if using recommendation service for upcoming', () => {
      beforeEach(() => {
        requestCache.fetchAem.withArgs('promo').resolves(aemSportPromoData);
        config.getDynamicConfig.returns({
          ...defaultConfig.dynamicConfig,
          toggles: {
            useInfoNextToGo: false,
          },
        });
      });
      it('should return tabs for all individual sports with upcoming matches', async () => {
        requestCache.fetchRecommendation.withArgs('recommendation:sports-next-to-go').resolves(n2g1);
        response = await sportCtrl.upcoming(req, res, next);
        response.type.should.eql('sports.sport.upcoming');
        response.discoveryKey.should.eql('bff:sports:sport:upcoming');
        response.data.length.should.eql(1);
        response.data[0].data.length.should.eql(4);
        response.data[0].data[0].title.should.eql('All Basketball');
        response.data[0].data[1].title.should.eql('FIBA World Cup Qualifiers');
        response.data[0].data[2].title.should.eql('NCAA Basketball');
        response.data[0].data[0].sportName.should.eql('Basketball');
        response.data[0].data[1].sportName.should.eql('Basketball');
        response.data[0].data[2].sportName.should.eql('Basketball');
      });

      it('should return upcoming matches data', async () => {
        sinon.useFakeTimers(Date.parse('2022-11-24T15:00:00.000Z'));
        requestCache.fetchRecommendation.withArgs('recommendation:sports-next-to-go').resolves(n2g1);
        response = await sportCtrl.upcoming(req, res, next);
        response.type.should.eql('sports.sport.upcoming');
        response.discoveryKey.should.eql('bff:sports:sport:upcoming');
        response.data.length.should.eql(1);
        assertUpcomingData(JSON.parse(JSON.stringify(response.data[0].data[0].data)));
      });

      it('should return only one chip with match data in case of single competition', async () => {
        requestCache.fetchRecommendation.withArgs('recommendation:sports-next-to-go').resolves(ntgSingleSport);
        response = await sportCtrl.upcoming(req, res, next);
        response.type.should.eql('sports.sport.upcoming');
        response.discoveryKey.should.eql('bff:sports:sport:upcoming');
        response.data.length.should.eql(1);
        response.data[0].type.should.eql('sports.sport.upcoming.chips');
        response.data[0].data.length.should.eql(1);
        response.data[0].data[0].title.should.eql('');
        response.data[0].data[0].sportName.should.eql('Basketball');
        response.data[0].data[0].data.length.should.eql(1);
      });

      it('should return groupings for future dates in dd/mm/yyyy format', async () => {
        sinon.useFakeTimers(Date.parse('2022-02-25T03:00:00.000Z'));
        requestCache.fetchRecommendation.withArgs('recommendation:sports-next-to-go').resolves(ntgSingleSport);
        const _req = { ...req, params: { sportName: 'Basketball' } };
        response = await sportCtrl.upcoming(_req, res, next);
        response.data.length.should.eql(1);
        response.data[0].data.length.should.eql(1);
        response.data[0].data[0].title.should.eql('');
        response.data[0].data[0].data.length.should.eql(1);
        response.data[0].data[0].data[0].type.should.eql('app.sports.timeGroups');
        response.data[0].data[0].data[0].groups.should.eql(['Today', 'Tomorrow', 'dd/mm/yyyy']);
      });

      it('should return groupings for future dates in  dd/mm/yyyy format if version > 12.4.1', async () => {
        sinon.useFakeTimers(Date.parse('2022-02-25T03:00:00.000Z'));
        requestCache.fetchRecommendation.withArgs('recommendation:sports-next-to-go').resolves(ntgSingleSport);
        req.query.version = '12.4.2';
        const _req = { ...req, params: { sportName: 'Basketball' } };
        response = await sportCtrl.upcoming(_req, res, next);
        response.data[0].data[0].data[0].groups.should.eql({
          today: 'Today',
          tomorrow: 'Tomorrow',
          thisYear: 'dd/mm/yyyy',
          nextYear: 'dd/mm/yyyy',
        });
      });

      describe('BetType toggle', () => {
        it('Should show no markets if BetTypes toggle is empty ([])', async () => {
          config.getDynamicConfig.returns({
            ...defaultConfig.dynamicConfig,
            toggles: {
              useInfoNextToGo: false,
            },
            displayBetTypes: [],
          });
          requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEventSingleSport);
          response = await sportCtrl.inPlay(req, res, next);
          response.type.should.eql('sports.sport.inplay');
          response.discoveryKey.should.eql('bff:sports:sport:in-play');
          const timeGroups = response.data[0].data[0];
          timeGroups.data[0].type.should.eql('sports.propositions.empty');
          should.not.exist(timeGroups.data[0].betOption);
        });
        it('Should show first market if BetTypes toggle is set to "ALL"', async () => {
          config.getDynamicConfig.returns({
            ...defaultConfig.dynamicConfig,
            toggles: {
              useInfoNextToGo: false,
            },
            displayBetTypes: ['all'],
          });
          requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEventSingleSport);
          response = await sportCtrl.inPlay(req, res, next);
          response.type.should.eql('sports.sport.inplay');
          response.discoveryKey.should.eql('bff:sports:sport:in-play');
          response.data.length.should.eql(1);
          const timeGroups = response.data[0].data[0];
          timeGroups.data[0].type.should.eql('sports.propositions.horizontal');
          timeGroups.data[0].betOption.should.eql('Head To Head');
        });
        it('Should show first matching market if BetTypes toggle is set to specific market(s)', async () => {
          config.getDynamicConfig.returns({
            ...defaultConfig.dynamicConfig,
            toggles: {
              useInfoNextToGo: false,
            },
            displayBetTypes: ['margin', 'line'],
          });
          requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEventSingleSport);
          response = await sportCtrl.inPlay(req, res, next);
          response.type.should.eql('sports.sport.inplay');
          response.discoveryKey.should.eql('bff:sports:sport:in-play');
          response.data.length.should.eql(1);
          const timeGroups = response.data[0].data[0];
          timeGroups.data[0].type.should.eql('sports.propositions.vertical');
          timeGroups.data[0].betOption.should.eql('Margin');
        });
      });
    });
    describe('if using info service for upcoming', () => {
      const request = {
        query: {
          jurisdiction: 'NSW',
          platform: 'mobile',
          os: 'ios',
          version: '1.0',
          homeState: '',
        },
        params: {
          sportName: 'Tennis',
        },
      };
      beforeEach(() => {
        config.get.returns(defaultConfig);
        config.getDynamicConfig.returns({
          ...defaultConfig.dynamicConfig,
          toggles: {
            useInfoNextToGo: true,
          },
        });
      });
      it('should return tabs for all individual sports with upcoming matches', async () => {
        requestCache.fetchInfo.withArgs('info:sports:nextToGo').resolves(infoUpcoming);
        response = await sportCtrl.upcoming(request, res, next);
        response.type.should.eql('sports.sport.upcoming');
        response.discoveryKey.should.eql('bff:sports:sport:upcoming');
        response.data.length.should.eql(1);
        response.data[0].type.should.eql('sports.sport.upcoming.chips');
        response.data[0].data.length.should.eql(3);
        response.data[0].data[0].title.should.eql('All Tennis');
        response.data[0].data[0].data[0].type.should.eql('app.sports.timeGroups');
        response.data[0].data[0].data[0].groups.length.should.eql(3);
        response.data[0].data[0].data[0].data.length.should.eql(3);
        assertInfoUpcomingData(JSON.parse(JSON.stringify(response.data[0].data[0].data[0].data)));
        response.data[0].data[1].title.should.eql('ATP Hertogenbosch');
        response.data[0].data[1].sportName.should.eql('Tennis');
        response.data[0].data[1].competitionName.should.eql('ATP');
        response.data[0].data[1].tournamentName.should.eql('ATP Hertogenbosch');
        response.data[0].data[1].discoveryKey.should.eql('bff:sports:competition:upcoming');
        response.data[0].data[1].filter.key.should.eql('tournamentName');
        response.data[0].data[1].filter.value.should.eql('ATP Hertogenbosch');
        response.data[0].data[2].tournamentName.should.eql('WTA Hertogenbosch');
      });
    });
  });

  describe('InPlay endpoint', () => {
    beforeEach(() => {
      sinon.useFakeTimers(Date.parse('2022-11-24T15:00:00.000Z'));
      requestCache.fetchAem.withArgs('promo').resolves(aemSportPromoData);
    });

    it('should return only one chip with match data in case of single competition', async () => {
      requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEventSingleSport);
      response = await sportCtrl.inPlay(req, res, next);
      response.type.should.eql('sports.sport.inplay');
      response.discoveryKey.should.eql('bff:sports:sport:in-play');
      response.data.length.should.eql(1);
      response.data[0].type.should.eql('sports.sport.inplay.chips');
      response.data[0].data.length.should.eql(1);
      response.data[0].data[0].title.should.eql('');
      response.data[0].data[0].defaultOddsCount.should.eql(4);
      response.data[0].data[0].oddsCountBuffer.should.eql(1);
      response.data[0].data[0].sportName.should.eql('Basketball');
    });

    it('should return tabs for all individual sports with inPlay matches', async () => {
      req.params.sportName = 'Basketball';
      requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEvents);
      response = await sportCtrl.inPlay(req, res, next);
      response.type.should.eql('sports.sport.inplay');
      response.discoveryKey.should.eql('bff:sports:sport:in-play');
      response.data.length.should.eql(1);
      response.data[0].type.should.eql('sports.sport.inplay.chips');
      response.data[0].data.length.should.eql(4);
      response.data[0].data[0].title.should.eql('All Basketball');
      response.data[0].data[0].defaultOddsCount.should.eql(4);
      response.data[0].data[0].oddsCountBuffer.should.eql(1);
      response.data[0].data[1].title.should.eql('NBA');
      response.data[0].data[2].title.should.eql('NBL');
      response.data[0].data[3].title.should.eql('NCAA Basketball');
      response.data[0].data[1].sportName.should.eql('Basketball');
      response.data[0].data[1].filter.should.eql({ key: 'competitionName', value: 'NBA' });
      response.data[0].data[2].filter.should.eql({ key: 'competitionName', value: 'NBL' });
      response.data[0].data[3].filter.should.eql({ key: 'competitionName', value: 'NCAA Basketball' });
      response.data[0].data[1].discoveryKey.should.eql('bff:sports:competition:in-play');
      response.data[0].data[2].discoveryKey.should.eql('bff:sports:competition:in-play');
      response.data[0].data[3].discoveryKey.should.eql('bff:sports:competition:in-play');
    });

    it('should return inPlay matches data', async () => {
      requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEvents);
      response = await sportCtrl.inPlay(req, res, next);
      response.type.should.eql('sports.sport.inplay');
      response.discoveryKey.should.eql('bff:sports:sport:in-play');
      response.data.length.should.eql(1);
      assertInPlayData(JSON.parse(JSON.stringify(response.data[0].data[0].data)));
    });

    describe('BetType toggle', () => {
      it('Should show no markets if BetTypes toggle is empty ([])', async () => {
        config.getDynamicConfig.returns({
          ...defaultConfig.dynamicConfig,
          displayBetTypes: [],
        });
        requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEventSingleSport);
        response = await sportCtrl.inPlay(req, res, next);
        response.type.should.eql('sports.sport.inplay');
        response.discoveryKey.should.eql('bff:sports:sport:in-play');
        response.data.length.should.eql(1);
        response.data[0].data[0].data[0].type.should.eql('sports.propositions.empty');
      });
      it('Should show first market if BetTypes toggle is set to "ALL"', async () => {
        config.getDynamicConfig.returns({
          ...defaultConfig.dynamicConfig,
          displayBetTypes: ['all'],
        });
        requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEventSingleSport);
        response = await sportCtrl.inPlay(req, res, next);
        response.type.should.eql('sports.sport.inplay');
        response.discoveryKey.should.eql('bff:sports:sport:in-play');
        response.data.length.should.eql(1);
        response.data[0].data[0].data[0].type.should.eql('sports.propositions.horizontal');
        response.data[0].data[0].data[0].betOption.should.eql('Head To Head');
      });
      it('Should show first matching market if BetTypes toggle is set to specific market(s)', async () => {
        config.getDynamicConfig.returns({
          ...defaultConfig.dynamicConfig,
          displayBetTypes: ['margin', 'line'],
        });
        requestCache.fetchRecommendation.withArgs('recommendation:live-events').resolves(liveEventSingleSport);
        response = await sportCtrl.inPlay(req, res, next);
        response.type.should.eql('sports.sport.inplay');
        response.discoveryKey.should.eql('bff:sports:sport:in-play');
        response.data.length.should.eql(1);
        response.data[0].data[0].data[0].type.should.eql('sports.propositions.vertical');
        response.data[0].data[0].data[0].betOption.should.eql('Margin');
      });
    });
  });
});
