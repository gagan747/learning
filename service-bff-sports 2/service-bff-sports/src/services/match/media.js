const config = require('../../config');
const { contentHubPreviewMatchTile } = require('../../constants/content-hub-keys');
const log = require('../../log');
const requestCache = require('../../request-cache');
const { fetchVisionFlags, isDeeplyEmpty } = require('../../utils');

const { sportsVisionChannels } = config.get();

const fetchTile = async (channelName, matchId, jurisdiction) => requestCache.fetchContentHub(
  contentHubPreviewMatchTile,
  { channelName, matchId, jurisdiction },
);

const toTileData = ({ overlay, ...tile }) => (
  isDeeplyEmpty(overlay)
    ? tile
    : {
      ...tile,
      overlay,
    }
);

const getMedia = async (referrer, competitionName, match, jurisdiction, hasStatsCentre) => {
  if (!match) {
    return undefined;
  }
  const { id: matchId, skySports, vision } = match;

  if (!vision && !skySports) {
    return undefined;
  }

  const data = [];
  const { hasPreview, hasVision } = fetchVisionFlags({ skySports, vision });

  if (hasVision) {
    const values = Object.values(vision)[0];
    const provider = Object.keys(vision)[0] || '';

    data.push({
      type: 'sports.match.vision',
      data: [
        {
          mediaType: values.requiresAuthentication ? 'vision' : 'visualisation',
          content: values,
          provider,
        },
      ],
    });
  }

  if (hasPreview) {
    data.push({
      type: 'sports.match.preview',
      data: [
        {
          mediaType: 'vision',
          provider: skySports.channel || 'sky',
          content: {
            _links: {
              providerStreamUrl: skySports.previewVideo,
            },
            requiresAuthentication: skySports.authenticationRequired,
          },
        },
      ],
    });
  }

  if (!data.length) {
    return undefined;
  }

  if (!hasPreview) {
    const channelName = sportsVisionChannels[competitionName];

    if (channelName) {
      try {
        const tile = await fetchTile(channelName, matchId, jurisdiction);

        data.push({ type: 'sports.match.tile', data: tile && tile.map(toTileData) });
      } catch (e) {
        log.error(e, `Error retrieving preview tile for match ${matchId}, jurisdiction: ${jurisdiction}; error ignored`);
      }
    }
  }

  const isFromPlayCentral = !!referrer && referrer.toLowerCase() === 'playcentral';
  const autoPlay = isFromPlayCentral && !hasStatsCentre;
  const isCollapsed = !isFromPlayCentral;
  const showWatchButton = isCollapsed && hasVision;
  const showPreviewButton = isCollapsed && hasPreview;

  const buttons = showWatchButton || showPreviewButton
    ? {
      type: 'sports.match.media.buttons',
      buttons: {
        showWatchButton,
        showPreviewButton,
      },
    }
    : undefined;

  return {
    media: {
      type: 'sports.match.media',
      collapsible: isCollapsed,
      isCollapsed,
      autoPlay,
      showWatchButton,
      showPreviewButton,
      data,
    },
    buttons,
  };
};

module.exports = { getMedia };
