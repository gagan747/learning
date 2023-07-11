const { screenMatch, bffTournamentMatch, bffCompetitionMatch } = require('../constants');
const { generateSportIcon, fetchVisionFlags, promotionFinder } = require('../utils');
const { getTemplate } = require('./betOptionsTemplate');

const mapNextToGoMatch = (promotions = []) => (match) => {
  const { hasPreview, hasVision } = fetchVisionFlags(match);
  const promoAvailable = !!promotionFinder(promotions)({
    sportName: match.sportName,
    competitionName: match.competitionName,
    tournamentName: match.tournamentName,
    matchId: match.id,
    matchStartTime: match.startTime,
  });
  return ({
    type: getTemplate(),
    title: match.name,
    subTitle: match.tournamentName || match.competitionName,
    matchId: match.id,
    inPlay: match.inPlay,
    goingInPlay: match.goingInPlay,
    startTime: match.startTime,
    displayTime: match.closeTime,
    hasVision: hasPreview || hasVision,
    sameGame: match.sameGame,
    promoAvailable,
    icon: generateSportIcon({ name: match.sportName }),
    propositions: [],
    navigation: {
      template: screenMatch,
      discoveryKey: match.tournamentName
        ? bffTournamentMatch : bffCompetitionMatch,
      params: {
        sportName: match.sportName,
        competitionName: match.competitionName,
        tournamentName: match.tournamentName,
        matchName: match.name,
      },
    },
  });
};

module.exports = {
  mapNextToGoMatch,
};
