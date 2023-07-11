const infoSports = require('../mocks/info-wift/sports/sports.json');

const sportsTransformer = require(`${global.SRC}/transformers/sports`);

const getSports = (limit = 50) => (
  [
    {
      id: '10',
      name: 'Rugby League',
      displayName: 'Rugby League',
      spectrumId: '10',
      _links: {},
      competitions: [],
    },
    {
      id: '1',
      name: 'AFL Football',
      displayName: 'AFL',
      spectrumId: '1',
      _links: {},
      competitions: [],
    },
    {
      id: '4',
      name: 'Basketball',
      displayName: 'Basketball',
      spectrumId: '4',
      _links: {},
      competitions: [],
    },
    {
      id: '3',
      name: 'Soccer',
      displayName: 'Soccer',
      spectrumId: '3',
      _links: {},
      competitions: [],
    },
    {
      id: '11',
      name: 'Tennis',
      displayName: 'Tennis',
      spectrumId: '11',
      _links: {},
      competitions: [],
    },
    {
      id: '53',
      name: 'Todays Offers',
      displayName: 'Todays Offers',
      spectrumId: '53',
      _links: {},
      competitions: [],
    },
    {
      id: '20',
      name: 'Ice Hockey',
      displayName: 'Ice Hockey',
      spectrumId: '20',
      _links: {},
      competitions: [],
    },
    {
      id: '7',
      name: 'Golf',
      displayName: 'Golf',
      spectrumId: '7',
      _links: {},
      competitions: [],
    },
    {
      id: '5',
      name: 'Boxing',
      displayName: 'Boxing',
      spectrumId: '5',
      _links: {},
      competitions: [],
    },
    {
      id: '51',
      name: 'UFC',
      displayName: 'UFC',
      spectrumId: '51',
      _links: {},
      competitions: [],
    },
    {
      id: '49',
      name: 'Racing Extras',
      displayName: 'Racing Extras',
      spectrumId: '49',
      _links: {},
      competitions: [],
    },
    {
      id: '56',
      name: 'Novelties',
      displayName: 'Novelties',
      spectrumId: '56',
      _links: {},
      competitions: [],
    },
    {
      id: '2',
      name: 'Cricket',
      displayName: 'Cricket',
      spectrumId: '2',
      _links: {},
      competitions: [],
    },
    {
      id: '13',
      name: 'American Football',
      displayName: 'American Football',
      spectrumId: '13',
      _links: {},
      competitions: [],
    },
    {
      id: '14',
      name: 'Baseball',
      displayName: 'Baseball',
      spectrumId: '14',
      _links: {},
      competitions: [],
    },
    {
      id: '22',
      name: 'Cycling',
      displayName: 'Cycling',
      spectrumId: '22',
      _links: {},
      competitions: [],
    },
    {
      id: '25',
      name: 'Darts',
      displayName: 'Darts',
      spectrumId: '25',
      _links: {},
      competitions: [],
    },
    {
      id: '45',
      name: 'Handball',
      displayName: 'Handball',
      spectrumId: '45',
      _links: {},
      competitions: [],
    },
    {
      id: '23',
      name: 'Jockey Challenge',
      displayName: 'Jockey Challenge',
      spectrumId: '23',
      _links: {},
      competitions: [],
    },
    {
      id: '15',
      name: 'Motor Sport',
      displayName: 'Motor Sport',
      spectrumId: '15',
      _links: {},
      competitions: [],
    },
    {
      id: '21',
      name: 'Netball',
      displayName: 'Netball',
      spectrumId: '21',
      _links: {},
      competitions: [],
    },
    {
      id: '24',
      name: 'Politics',
      displayName: 'Politics',
      spectrumId: '24',
      _links: {},
      competitions: [],
    },
    {
      id: '9',
      name: 'Rugby Union',
      displayName: 'Rugby Union',
      spectrumId: '9',
      _links: {},
      competitions: [],
    },
    {
      id: '27',
      name: 'Snooker',
      displayName: 'Snooker',
      spectrumId: '27',
      _links: {},
      competitions: [],
    },
    {
      id: '26',
      name: 'Surfing',
      displayName: 'Surfing',
      spectrumId: '26',
      _links: {},
      competitions: [],
    },
    {
      id: '48',
      name: 'Sports Exotics',
      displayName: 'Retail Offers',
      spectrumId: '48',
      _links: {},
      competitions: [],
    },
    {
      id: '32',
      name: 'Volleyball',
      displayName: 'Volleyball',
      spectrumId: '32',
      _links: {},
      competitions: [],
    },
    {
      id: '59',
      name: 'Esports',
      displayName: 'Esports',
      spectrumId: '59',
      _links: {},
      competitions: [],
    },
  ].slice(0, limit)
);
const assertSportsData = (result) => {
  result.should.eql([
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
        params: { sportName: 'Rugby League' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
    {
      displayName: 'AFL',
      spectrumId: '1',
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'afl_football',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: { sportName: 'AFL Football' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
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
        params: { sportName: 'Basketball' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
  ]);
};
const assertSportsDataNoIcon = (result) => {
  result.should.eql([
    {
      displayName: 'Rugby League',
      spectrumId: '10',
      promoAvailable: false,
      navigation: {
        params: { sportName: 'Rugby League' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
    {
      displayName: 'AFL',
      spectrumId: '1',
      promoAvailable: false,
      navigation: {
        params: { sportName: 'AFL Football' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
    {
      displayName: 'Basketball',
      spectrumId: '4',
      promoAvailable: false,
      navigation: {
        params: { sportName: 'Basketball' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
  ]);
};
const assertSportsSortedData = (result) => {
  result.should.eql([
    {
      displayName: 'AFL',
      spectrumId: '1',
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'afl_football',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: { sportName: 'AFL Football' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
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
        params: { sportName: 'Basketball' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
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
        params: { sportName: 'Rugby League' },
        template: 'screen:sport',
        discoveryKey: 'bff:sports:sport',
      },
    },
  ]);
};

const assertFeaturedData = (resultData) => {
  resultData.should.eql([
    {
      displayName: 'NRL',
      sameGame: true,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'rugby_league',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'Rugby League',
          competitionName: 'NRL',
        },
        template: 'screen:sport:competition',
        discoveryKey: 'bff:sports:competition',
      },
    },
    {
      displayName: 'AFL',
      sameGame: true,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'afl_football',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'AFL Football',
          competitionName: 'AFL',
        },
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
        params: {
          sportName: 'Basketball',
          competitionName: 'NBA',
        },
        template: 'screen:sport:competition',
        discoveryKey: 'bff:sports:competition',
      },
    },
    {
      displayName: 'A League Men',
      sameGame: true,
      promoAvailable: false,
      icon: {
        appIconIdentifier: 'soccer',
        imageURL: '',
        keepOriginalColor: true,
      },
      navigation: {
        params: {
          sportName: 'Soccer',
          competitionName: 'A League Men',
        },
        template: 'screen:sport:competition',
        discoveryKey: 'bff:sports:competition',
      },
    },
    {
      displayName: 'Masters Monte Carlo',
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
          tournamentName: 'Masters Monte Carlo',
        },
        template: 'screen:sport:tournament',
        discoveryKey: 'bff:sports:tournament',
      },
    },
  ]);
};

describe('Sports transformer', () => {
  const excludedRacingSports = ['48', '49', '23', '36', '37', '47', '18', '19', '8'];

  describe('getSports', () => {
    it('Should exclude the racing sports', () => {
      const sports = getSports();
      const result = sportsTransformer.excludeRacingSports(sports);
      result.length.should.eql(25);
      result.forEach((sport) => {
        sport.spectrumId.should.not.be.oneOf(excludedRacingSports);
      });
    });

    it('Should enhance details for individual sport items', () => {
      const sports = getSports(3);
      const result = sportsTransformer.formatItems()(sports, {
        discoveryKey: 'bff:sports:sport',
        template: 'screen:sport',
      });

      result.length.should.eql(3);
      assertSportsData(JSON.parse(JSON.stringify(result)));
    });

    it('Should not include icon if includeIcon flag is passed as false', () => {
      const sports = getSports(3);
      const result = sportsTransformer.formatItems()(sports, {
        discoveryKey: 'bff:sports:sport',
        template: 'screen:sport',
        includeIcon: false,
      });

      result.length.should.eql(3);
      assertSportsDataNoIcon(JSON.parse(JSON.stringify(result)));
    });

    it('Should return A-Z list', () => {
      const sports = getSports(3);
      const result = sportsTransformer.getAZList()(sports);

      result.title.should.eql('A - Z');
      result.data.length.should.eql(3);
      assertSportsSortedData(JSON.parse(JSON.stringify(result.data)));
    });
  });

  describe('getCompetitions', () => {
    it('Should include 5 featured competitions', () => {
      const result = sportsTransformer.getCompetitions(infoSports);
      result.title.should.eql('Featured');
      result.data.length.should.eql(5);
      assertFeaturedData(result.data);
    });
  });
});
