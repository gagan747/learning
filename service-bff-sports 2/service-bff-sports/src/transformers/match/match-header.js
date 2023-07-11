const { generateSportIcon } = require('../../utils');

const matchHeaderGetter = ({
  sportName,
  competitionName,
  tournamentName,
}) => ({
  markets,
  startTime,
  inPlay,
}) => ({
  type: 'sports.match.header',
  title: tournamentName || competitionName,
  displayTime: markets[0].closeTime,
  startTime,
  onlineBetting: markets[0].onlineBetting,
  phoneBettingOnly: markets[0].phoneBettingOnly,
  inPlay,
  icon: generateSportIcon({ name: sportName }),
});

module.exports = {
  matchHeaderGetter,
};
