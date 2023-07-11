module.exports = {
  title: 'Popular Same Game Multi',
  data: [
    {
      betOption: 'Popular Same Game Multi 1',
      type: 'sports.trending.samegamemulti',
      enabledPsgmTweak: false,
      data: [
        {
          title: '2 Leg Same Game Multi',
          subtitle: '4 punters',
          odds: 6.5,
          sortOrder: 1,
          legs: [
            {
              betOption: 'Result',
              betOptionPriority: 75,
              proposition: {
                id: '237338',
                numberId: 237338,
                number: 237338,
                name: 'Shimizu',
                position: 'HOME',
                sortOrder: 1,
                returnWin: 2.6,
                returnPlace: 0,
                bettingStatus: 'Open',
                isOpen: true,
                allowPlace: false,
              },
            },
            {
              betOption: 'Total Goals Over/Under',
              betOptionPriority: 795,
              proposition: {
                id: '237489',
                numberId: 237489,
                number: 237489,
                name: 'Under 0.5 Goals',
                sortOrder: 2,
                returnWin: 7.5,
                returnPlace: 0,
                bettingStatus: 'Open',
                isOpen: true,
                allowPlace: false,
              },
            },
          ],
        },
      ],
    },
  ],
};
