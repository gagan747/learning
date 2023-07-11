const { getContestantIcons } = require('../utils/icon');

const shortenName = (str = '') => {
  const obj = {
    ' Over ': ' Ovr ',
    ' Under ': ' Und ',
  };
  return str.replace(/ Over | Under /, (matched) => obj[matched]);
};

const propositionMapper = (
  contestants = [],
  shortenPropositionName = false,
  showSameGameInfo = false,
  stats = {},
) => {
  const contestantIcons = getContestantIcons(contestants);

  return (proposition) => {
    const imageURL = contestantIcons[Object.keys(contestantIcons).find(
      (contestantName) => proposition.name.includes(contestantName),
    )];

    let propStats;
    if (stats.forProposition) {
      const _stat = stats.propositions.find(
        (it) => `${it.propositionId}` === `${proposition.id}`,
      );
      if (_stat) {
        propStats = {
          type: 'sports.stats.inline',
          data: _stat.stats || [],
        };
      }
    }

    return {
      id: proposition.id,
      numberId: proposition.number,
      number: proposition.number,
      name: shortenPropositionName ? shortenName(proposition.name) : proposition.name,
      position: proposition.position,
      sortOrder: proposition.sortOrder,
      returnWin: proposition.returnWin,
      returnPlace: proposition.returnPlace,
      bettingStatus: proposition.bettingStatus,
      isOpen: proposition.isOpen,
      allowPlace: proposition.allowPlace,
      icon: imageURL && { imageURL },
      ...(propStats ? { stats: propStats } : {}),
      ...(showSameGameInfo ? { sameGame: proposition.sameGame } : {}),
    };
  };
};

module.exports = {
  propositionMapper,
};
