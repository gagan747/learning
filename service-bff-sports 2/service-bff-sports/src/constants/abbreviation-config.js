module.exports.abbreviationConfig = {
  title: {
    headerStyling: {
      fontWeight: 'semiBold',
    },
    showHeader: true,
  },
  p: {
    description: 'Played',
    headerStyling: {
      fontWeight: 'semiBold',
    },
    showHeader: true,
    priority: 4,
  },
  w: {
    description: 'Won',
    headerStyling: {
      fontWeight: 'semiBold',
    },
    showHeader: true,
    priority: 5,
  },
  l: {
    description: 'Lost',
    headerStyling: {
      fontWeight: 'semiBold',
    },
    showHeader: true,
    priority: 6,
  },
  h: {
    description: 'Home',
    headerStyling: {
      fontWeight: 'semiBold',
    },
    showHeader: true,
    priority: 7,
  },
  stk: {
    description: 'Streak',
    headerStyling: {
      fontWeight: 'semiBold',
    },
    showHeader: true,
    priority: 9,
  },
  W: {
    description: 'Streak %NUM% Win',
    rowStyling: {
      fontWeight: 'semiBold',
      fontColor: 'green',
    },
  },
  D: {
    description: 'Streak %NUM% Draw',
    rowStyling: {
      fontWeight: 'semiBold',
      fontColor: 'gray',
    },
  },
  L: {
    description: 'Streak %NUM% Loss',
    rowStyling: {
      fontWeight: 'semiBold',
      fontColor: 'red',
    },
  },
  a: {
    description: 'Away',
    headerStyling: {
      fontWeight: 'semiBold',
    },
    showHeader: true,
    priority: 8,
  },
  rank: {
    description: 'Rank %RANK%',
    rowStyling: {
      fontWeight: 'semiBold',
    },
    priority: 3,
    vtype: 'string',
  },
  teamName: {
    description: '%TEAMNAME%',
    priority: 1,
  },
  clubLogo: {
    description: '',
    vType: 'imageUrl',
    priority: 2,
    showHeader: false,
  },
};
