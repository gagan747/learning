const { getOffers, getOffer } = require('../services/offers');
const errorHandlers = require('../utils/error-handlers');

const page = async (req, res) => {
  try {
    const { jurisdiction, homeState, activeTab } = req.query;
    const offers = await getOffers({ activeTab }, { jurisdiction, homeState });
    return res.json(offers);
  } catch (e) {
    return errorHandlers.handleError(e, res, 'Error fetching Offers page.');
  }
};

const offer = async (req, res) => {
  try {
    const { jurisdiction, homeState } = req.query;
    const { offerName } = req.params;
    const offerData = await getOffer({ offerName }, { jurisdiction, homeState });
    return res.json(offerData);
  } catch (e) {
    return errorHandlers.handleError(e, res, 'Error fetching Offer details.');
  }
};

module.exports = {
  page,
  offer,
};
