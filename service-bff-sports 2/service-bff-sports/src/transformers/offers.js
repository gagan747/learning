const { bffOffer } = require('../constants');
const { fieldSorter } = require('../utils');

const byDisplayTime = fieldSorter('displayTime');

const mapOfferData = ({ matches, hasVenues = true }) => {
  const data = [{
    title: 'All Offers',
    data: matches.sort(byDisplayTime),
  }];

  if (hasVenues) {
    data.push({
      title: 'Venue Exclusive Offers',
      filter: {
        key: 'isVenueExclusive',
        value: true,
      },
    });
  }
  return [{
    type: 'sports.offers.offer.chips',
    data,
  }];
};

const formatOfferResponse = ({ matches, hasVenues }) => ({
  type: 'sports.offers.offer',
  discoveryKey: bffOffer,
  data: mapOfferData({ matches, hasVenues }),
});

const formatOffersResponse = ({ matches, tabs, hasVenues }) => {
  const offersTabsData = tabs.map((tab) => ({
    ...tab,
    data: tab.active ? mapOfferData({ matches, hasVenues }) : undefined,
  }));

  return {
    type: 'sports.offers.home',
    title: 'Offers',
    data: [
      {
        type: 'sports.offers.tabs',
        data: offersTabsData,
      },
    ],
  };
};

module.exports = {
  formatOffersResponse,
  formatOfferResponse,
};
