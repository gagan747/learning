const newrelic = require('newrelic');

const log = require('../log');
const requestCache = require('../request-cache');

const getCarouselIcon = async (urlParams) => {
  try {
    const response = await requestCache.fetchAem('sport', urlParams);

    if (!response.items || !response.items.length) {
      return undefined;
    }

    return {
      type: 'sports.carousel.icon',
      data: response.items[0].items.map((item) => ({
        title: item.label,
        dataUrl: item.hrefLink,
        icon: {
          appIconIdentifier: item.tileIcon.appIconIdentifier,
          imageURL: item.tileIcon.imageUrl,
          keepOriginalColor: item.keepOriginalColor,
        },
      })),
    };
  } catch (e) {
    log.error(e, 'aem failed');
    newrelic.noticeError(e);
  }

  return undefined;
};

module.exports = {
  getCarouselIcon,
};
