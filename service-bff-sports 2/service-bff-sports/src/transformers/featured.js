const {
  fieldSorter, partition, getDateGroups, removeEmpty,
} = require('../utils');

const byDisplayTime = fieldSorter('displayTime');

const toTabData = (key, title) => ({
  title,
  discoveryKey: 'bff:sports:competition:featured',
  filter: { key, value: title },
});

const formatFeaturedResponse = ({
  version,
}) => (toMatchData) => ({ name, displayName, competitions }) => {
  const matches = [];
  const competitionTabs = [];

  competitions.forEach((competition) => {
    if (competition.matches) {
      competition.matches.forEach((match) => {
        matches.push(toMatchData({
          sportName: name,
          competitionName: competition.name,
        })(match));
      });
      competitionTabs.push(toTabData('competitionName', competition.name));
    }
    competition.tournaments.forEach((tournament) => {
      tournament.matches.forEach((match) => {
        matches.push(toMatchData({
          sportName: name,
          competitionName: competition.name,
          tournamentName: tournament.name,
        })(match));
      });
      competitionTabs.push(toTabData('tournamentName', tournament.name));
    });
  });

  const [inPlayMatches, upcomingMatches] = partition(matches, (m) => m.inPlay);

  const allMatchesData = [];
  if (inPlayMatches.length) {
    allMatchesData.push({
      title: 'In-Play',
      data: inPlayMatches
        .filter(removeEmpty)
        .sort(byDisplayTime),
    });
  }
  if (upcomingMatches.length) {
    allMatchesData.push(getDateGroups({
      matches: upcomingMatches.filter(removeEmpty),
      includeFutures: true,
      version,
    }));
  }

  return [
    {
      type: 'sports.sport.featured.chips',
      data: [
        {
          title: `All ${displayName}`,
          sportName: name,
          data: allMatchesData,
          discoveryKey: 'bff:sports:sport:featured',
        },
        ...competitionTabs,
      ],
    },
  ].filter((d) => d.data.length);
};

module.exports = {
  formatFeaturedResponse,
};
