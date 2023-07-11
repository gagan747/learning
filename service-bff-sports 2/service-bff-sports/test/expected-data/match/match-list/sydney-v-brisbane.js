module.exports = [
  {
    name: 'Wst Bulldogs v Essendon',
    displayName: 'Wst Bulldogs v Essendon',
    active: false,
    sameGame: true,
    promoAvailable: false,
    navigation: {
      template: 'screen:sport:match',
      discoveryKey: 'bff:sports:match:page',
      params: {
        sportName: 'AFL Football',
        competitionName: 'AFL',
        matchName: 'Wst Bulldogs v Essendon',
      },
    },
  },
  {
    name: 'Sydney v Brisbane',
    displayName: 'Sydney v Brisbane',
    active: true,
    sameGame: true,
    promoAvailable: false,
    navigation: {
      template: 'screen:sport:match',
      discoveryKey: 'bff:sports:match:page',
      params: {
        sportName: 'AFL Football',
        competitionName: 'AFL',
        matchName: 'Sydney v Brisbane',
      },
    },
  },
  {
    name: 'Richmond v Collingwood',
    displayName: 'Richmond v Collingwood',
    active: false,
    sameGame: false,
    promoAvailable: false,
    navigation: {
      template: 'screen:sport:match',
      discoveryKey: 'bff:sports:match:page',
      params: {
        sportName: 'AFL Football',
        competitionName: 'AFL',
        matchName: 'Richmond v Collingwood',
      },
    },
  },
];
