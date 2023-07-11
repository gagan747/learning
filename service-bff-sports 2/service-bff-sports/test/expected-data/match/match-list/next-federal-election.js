module.exports = [
  {
    name: 'Next Federal Election',
    displayName: 'Next Federal Election',
    active: true,
    sameGame: false,
    promoAvailable: false,
    navigation: {
      template: 'screen:sport:match',
      discoveryKey: 'bff:sports:match:page',
      params: {
        sportName: 'Politics',
        competitionName: 'Australian Federal Politics',
        matchName: 'Next Federal Election',
      },
    },
  },
];
