const config = require('../config');
const { screenMatch, bffTournamentMatch, bffCompetitionMatch } = require('../constants');
const { promotionFinder } = require('../utils');

const matchCarouselGetter = ({
  sportName,
  competitionName,
  tournamentName,
  matchName,
}) => {
  const imageURLs = config.getDynamicConfig().defaultMatchCarouselImages[competitionName] || [];
  const l = imageURLs.length;

  return ({
    matches,
  }) => ({
    type: 'sports.match.carousel',
    matches: matches.reduce((acc, match, i) => {
      if (match.name === matchName || !match.vision) {
        return acc;
      }

      acc.push({
        title: match.name,
        startTime: match.startTime,
        imageURL: imageURLs[i % l] || '',
        navigation: {
          template: screenMatch,
          discoveryKey: tournamentName
            ? bffTournamentMatch : bffCompetitionMatch,
          params: {
            sportName,
            competitionName,
            tournamentName,
            matchName: match.name,
          },
        },
      });

      return acc;
    }, []),
  });
};

const matchListGetter = ({
  sportName,
  competitionName,
  tournamentName,
  matchName,
}) => ({ matches }, promotions, params) => {
  const findPromotion = promotionFinder(promotions);
  return ({
    type: 'sports.match.list',
    title: matchName,
    data: matches.map((
      {
        id,
        name,
        sameGame = false,
        startTime = '',
      },
    ) => ({
      name,
      displayName: name,
      active: name === matchName,
      sameGame,
      promoAvailable: !!findPromotion({ ...params, matchId: id, matchStartTime: startTime }),
      navigation: {
        template: screenMatch,
        discoveryKey: tournamentName ? bffTournamentMatch : bffCompetitionMatch,
        params: {
          sportName,
          competitionName,
          tournamentName,
          matchName: name,
        },
      },
    })),
  });
};

module.exports = {
  matchCarouselGetter,
  matchListGetter,
};
