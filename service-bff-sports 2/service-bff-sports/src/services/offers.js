const config = require('../config');
const { bffOffer } = require('../constants');
const { infoSports, infoSportCompetition } = require('../constants/info-keys');
const requestCache = require('../request-cache');
const { matchMapper, formatOffersResponse, formatOfferResponse } = require('../transformers');

const mapMatch = matchMapper({ displayBetTypes: ['all'] });
const trimOffer = (name) => {
  const index = name.toLowerCase().lastIndexOf(' offers');
  return index > 0 ? name.substr(0, index) : name;
};

const offerMatchMapper = ({ isFeatured, isVenueExclusive }) => (toMatch) => (match) => {
  const _match = toMatch(match);
  return {
    ..._match,
    type: 'sports.propositions.vertical',
    isFeatured,
    isVenueExclusive,
    icon: undefined,
    subTitle: _match.message || _match.subTitle,
  };
};

const getConfigCompMap = (configOffersCompList) => (configOffersCompList
  .reduce((acc, comp) => {
    const { venueCompetitions, venueDefaultTitle, venueDefaultName } = comp;
    venueCompetitions.forEach((venueComp) => {
      acc.set(venueComp.id, {
        defaultTitle: venueDefaultTitle,
        defaultName: venueDefaultName,
        isFeatured: venueComp.isFeatured,
      });
    });
    return acc;
  }, new Map()));

const fetchMatchesForVenueOnly = async ({
  retailOffers,
  configCompMap,
  activeCompetitionName,
  jurisdiction,
  homeState,
}) => {
  const _matches = [];
  await Promise.all(retailOffers.competitions.map(async (comp) => {
    const { defaultName, isFeatured } = configCompMap.get(comp.id);

    if (configCompMap.has(comp.spectrumId) && defaultName === activeCompetitionName) {
      const { matches = [] } = await requestCache.fetchInfo(infoSportCompetition, {
        sportName: retailOffers.name,
        competitionName: comp.name,
        jurisdiction,
        homeState,
      });

      const toOfferMatch = offerMatchMapper({
        isFeatured,
        isVenueExclusive: true,
      })(mapMatch({ sportName: retailOffers.name, competitionName: comp.name }));

      _matches.push(...matches.map(toOfferMatch));
    }
  }));
  return _matches;
};

const fetchMatchesForAllOffers = async ({ offerList, jurisdiction, homeState }) => {
  const _matches = [];

  await Promise.all(offerList.map(async (offer) => {
    const {
      sportName, competitionName, isFeatured, isVenueExclusive,
    } = offer;

    const { matches = [] } = await requestCache.fetchInfo(infoSportCompetition, {
      sportName, competitionName, jurisdiction, homeState,
    });

    const toOfferMatch = offerMatchMapper({
      isFeatured,
      isVenueExclusive,
    })(mapMatch({ sportName, competitionName }));

    _matches.push(...matches.map(toOfferMatch));
  }));
  return _matches;
};

const prepareOfferList = ({
  todaysOffers,
  retailOffers,
  activeCompetition,
  configOffersCompList,
}) => {
  const offerList = [{
    sportName: todaysOffers.name,
    competitionName: activeCompetition.name,
    isFeatured: false,
    isVenueExclusive: false,
  }];

  const competitionsWithVenue = configOffersCompList
    .find((comp) => comp.competitionId === activeCompetition.spectrumId);

  let hasVenues = false;

  if (retailOffers && retailOffers.competitions && competitionsWithVenue) {
    competitionsWithVenue.venueCompetitions.forEach((venueComp) => {
      const retailCompetition = retailOffers.competitions
        .find((retailComp) => retailComp.spectrumId === venueComp.id);

      if (!retailCompetition) { return; }

      offerList.push({
        sportName: retailOffers.name,
        competitionName: retailCompetition.name,
        isFeatured: venueComp.isFeatured,
        isVenueExclusive: true,
      });
      hasVenues = true;
    });
  }
  return { offerList, hasVenues };
};

const fetchMatchesAndVenueFlag = async ({ urlParams, activeCompetition }) => {
  const {
    todaysOffers, retailOffers, configOffersCompList, jurisdiction, homeState,
  } = urlParams;
  const { offerList, hasVenues } = prepareOfferList({
    todaysOffers,
    retailOffers,
    activeCompetition,
    configOffersCompList,
  });

  const _matches = await fetchMatchesForAllOffers({ offerList, jurisdiction, homeState });

  return { _matches, hasVenues };
};

const fetchVenueOnlyDataForOffers = (activeTab) => async ({
  retailOffers,
  configOffersCompList,
  jurisdiction,
  homeState,
}) => {
  const configCompMap = getConfigCompMap(configOffersCompList);

  const activeCompetitionName = activeTab
  || configCompMap.get(retailOffers.competitions[0].spectrumId).defaultName;

  const tabs = retailOffers.competitions.reduce((offerTabs, comp) => {
    const { defaultTitle, defaultName } = configCompMap.get(comp.id);
    if (!offerTabs.some((tab) => (
      tab.title === configCompMap.get(comp.id).defaultTitle))) {
      offerTabs.push({
        title: defaultTitle,
        offerName: defaultName,
        discoveryKey: bffOffer,
        active: defaultName === activeCompetitionName,
      });
    }
    return offerTabs;
  }, []);

  const _matches = await fetchMatchesForVenueOnly({
    retailOffers, configCompMap, activeCompetitionName, jurisdiction, homeState,
  });

  return formatOffersResponse({ matches: _matches, tabs });
};

const fetchVenueOnlyDataForSingleOffer = (offerName) => async ({
  retailOffers,
  configOffersCompList,
  jurisdiction,
  homeState,
}) => {
  const configCompMap = getConfigCompMap(configOffersCompList);

  const activeCompetitionName = offerName;

  const _matches = await fetchMatchesForVenueOnly({
    retailOffers, configCompMap, activeCompetitionName, jurisdiction, homeState,
  });

  return formatOfferResponse({ matches: _matches });
};

const fetchAllOffersForOffers = (activeTab) => async (urlParams) => {
  const { todaysOffers } = urlParams;

  const activeCompetition = activeTab
    ? todaysOffers.competitions.find((comp) => comp.name === activeTab)
    : todaysOffers.competitions[0];

  const tabs = todaysOffers.competitions.map((competition) => ({
    title: trimOffer(competition.name),
    offerName: competition.name,
    discoveryKey: bffOffer,
    active: competition.name === activeCompetition.name,
  }));

  const { _matches, hasVenues } = await fetchMatchesAndVenueFlag({ urlParams, activeCompetition });

  return formatOffersResponse({ matches: _matches, tabs, hasVenues });
};

const fetchAllOffersForSingleOffer = (offerName) => async (urlParams) => {
  const { todaysOffers } = urlParams;

  const activeCompetition = todaysOffers.competitions.find((comp) => comp.name === offerName);

  const { _matches, hasVenues } = await fetchMatchesAndVenueFlag({ urlParams, activeCompetition });

  return formatOfferResponse({ matches: _matches, hasVenues });
};

const fetchOffersData = (isSingleOffer) => async (
  { offerName, activeTab },
  { jurisdiction, homeState },
) => {
  const { offers } = config.getDynamicConfig();
  const offerJurisdiction = offers.jurisdictionOverrides.includes(jurisdiction) ? jurisdiction : 'ALL';
  const configOffersCompList = offers.competitionsWithInVenueOnly[offerJurisdiction];
  const { sports } = await requestCache.fetchInfo(infoSports, { jurisdiction, homeState });
  const todaysOffers = sports.find((sport) => sport.spectrumId === offers.sportId);
  const retailOffers = sports.find((sport) => sport.spectrumId === offers.retailSportId);

  if (!todaysOffers && !retailOffers) {
    return {};
  }

  let data = {};
  let venueOnly = true;

  if (todaysOffers
    && todaysOffers.competitions
    && todaysOffers.competitions.length) {
    const urlParams = {
      todaysOffers,
      retailOffers,
      configOffersCompList,
      jurisdiction,
      homeState,
    };
    data = isSingleOffer
      ? await fetchAllOffersForSingleOffer(offerName)(urlParams)
      : await fetchAllOffersForOffers(activeTab)(urlParams);
    venueOnly = false;
  }

  if (venueOnly
    && retailOffers
    && retailOffers.competitions
    && retailOffers.competitions.length) {
    const urlParams = {
      retailOffers,
      configOffersCompList,
      offerName,
      activeTab,
      jurisdiction,
      homeState,
    };
    data = isSingleOffer
      ? await fetchVenueOnlyDataForSingleOffer(offerName)(urlParams)
      : await fetchVenueOnlyDataForOffers(activeTab)(urlParams);
  }

  return data;
};

const getOffer = fetchOffersData(true);

const getOffers = fetchOffersData(false);

module.exports = {
  getOffers,
  getOffer,
};
