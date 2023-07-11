const sinon = require('sinon');

const racingOfferAllData = require('../expected-data/offers/racing-offers');
const sportsOfferAllDataWithFeatured = require('../expected-data/offers/sports-offers');
const offerChipsData = require('../expected-data/offers/state-finals-hub');
const venueOnlyOfferAllData = require('../expected-data/offers/venue-only-offer');
const venueOnlyOffersAllData = require('../expected-data/offers/venue-only-offers');
const featuredoffer = require('../mocks/info-wift/offers/featured-offers.json');
const racingoffers = require('../mocks/info-wift/offers/racing-offers.json');
const racingretailoffer = require('../mocks/info-wift/offers/racing-retail-offers.json');
const sportsoffers = require('../mocks/info-wift/offers/sports-offers.json');
const sportsretailoffer = require('../mocks/info-wift/offers/sports-retail-offers.json');
const sportsvenueonly = require('../mocks/info-wift/offers/sports-venue-only.json');
const sports = require('../mocks/info-wift/offers/sports.json');
const statefinalshub = require('../mocks/info-wift/offers/state-finals-hub.json');

const offersController = require(`${global.SRC}/controllers/offers`);
const requestCache = require(`${global.SRC}/request-cache`);

describe('Offers controller', () => {
  const res = {
    json: (args) => args,
    status: (args) => args,
  };

  const next = () => {};

  let response;

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    sinon.stub(requestCache, 'fetchInfo');
  });

  describe('Offers page response', () => {
    describe('without activeTab value passed | when non sport/racing competition selected default | no venue offers', () => {
      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:sports').resolves(sports);
        requestCache.fetchInfo.withArgs('info:sport:competiton', {
          sportName: 'Todays Offers', competitionName: 'State Finals Hub', jurisdiction: 'NSW', homeState: '',
        }).resolves(statefinalshub);

        response = JSON.parse(JSON.stringify(
          await offersController.page(
            {
              query: {
                jurisdiction: 'NSW',
                homeState: '',
              },
            },
            res,
            next,
          ),
        ));
      });

      it('has type "sports.offers.home"', () => {
        response.type.should.eql('sports.offers.home');
      });
      it('has title "Offers"', () => {
        response.title.should.eql('Offers');
      });

      describe('has data', () => {
        it('with one item', () => {
          response.data.length.should.eql(1);
        });

        it('with type "sports.offers.tabs"', () => {
          response.data[0].type.should.eql('sports.offers.tabs');
        });

        describe('has data', () => {
          it('with 3 items', () => {
            response.data[0].data.length.should.eql(3);
          });
          describe('with correct values for first tab', () => {
            it('with title "State Finals Hub"', () => {
              response.data[0].data[0].title.should.eql('State Finals Hub');
            });
            it('with offerName "State Finals Hub"', () => {
              response.data[0].data[0].offerName.should.eql('State Finals Hub');
            });
            it('with discoveryKey "bff:sports:offer"', () => {
              response.data[0].data[0].discoveryKey.should.eql('bff:sports:offer');
            });
            it('with active status true', () => {
              response.data[0].data[0].active.should.eql(true);
            });
            it('with correct data for offer chips', () => {
              response.data[0].data[0].data.should.eql(offerChipsData);
            });
          });
          describe('with correct values for second tab', () => {
            it('with title "Sports"', () => {
              response.data[0].data[1].title.should.eql('Sports');
            });
            it('with offerName "Sports Offers"', () => {
              response.data[0].data[1].offerName.should.eql('Sports Offers');
            });
            it('with discoveryKey "bff:sports:offer"', () => {
              response.data[0].data[1].discoveryKey.should.eql('bff:sports:offer');
            });
            it('with active status false', () => {
              response.data[0].data[1].active.should.eql(false);
            });
          });
          describe('with correct values for third tab', () => {
            it('with title "Racing"', () => {
              response.data[0].data[2].title.should.eql('Racing');
            });
            it('with offerName "Racing Offers"', () => {
              response.data[0].data[2].offerName.should.eql('Racing Offers');
            });
            it('with discoveryKey "bff:sports:offer"', () => {
              response.data[0].data[2].discoveryKey.should.eql('bff:sports:offer');
            });
            it('with active status false', () => {
              response.data[0].data[2].active.should.eql(false);
            });
          });
        });
      });
    });
    describe('with activeTab value passed as "Racing Offers" and with venue exclusive offers', () => {
      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:sports').resolves(sports);
        requestCache.fetchInfo.withArgs('info:sport:competiton', {
          sportName: 'Sports Exotics', competitionName: 'Racing Retail Offer', jurisdiction: 'NSW', homeState: '',
        }).resolves(racingretailoffer);
        requestCache.fetchInfo.withArgs('info:sport:competiton', {
          sportName: 'Todays Offers', competitionName: 'Racing Offers', jurisdiction: 'NSW', homeState: '',
        }).resolves(racingoffers);
        response = JSON.parse(JSON.stringify(
          await offersController.page(
            {
              query: {
                jurisdiction: 'NSW',
                homeState: '',
                activeTab: 'Racing Offers',
              },
            },
            res,
            next,
          ),
        ));
      });
      it('has type "sports.offers.home"', () => {
        response.type.should.eql('sports.offers.home');
      });
      it('has title "Offers"', () => {
        response.title.should.eql('Offers');
      });

      describe('has data', () => {
        it('with one item', () => {
          response.data.length.should.eql(1);
        });

        it('with type "sports.offers.tabs"', () => {
          response.data[0].type.should.eql('sports.offers.tabs');
        });

        describe('has data', () => {
          it('with 3 items', () => {
            response.data[0].data.length.should.eql(3);
          });
          describe('with correct values for first tab', () => {
            it('with title "State Finals Hub"', () => {
              response.data[0].data[0].title.should.eql('State Finals Hub');
            });
            it('with offerName "State Finals Hub"', () => {
              response.data[0].data[0].offerName.should.eql('State Finals Hub');
            });
            it('with discoveryKey "bff:sports:offer"', () => {
              response.data[0].data[0].discoveryKey.should.eql('bff:sports:offer');
            });
            it('with active status false', () => {
              response.data[0].data[0].active.should.eql(false);
            });
          });
          describe('with correct values for second tab', () => {
            it('with title "Sports"', () => {
              response.data[0].data[1].title.should.eql('Sports');
            });
            it('with offerName "Sports Offers"', () => {
              response.data[0].data[1].offerName.should.eql('Sports Offers');
            });
            it('with discoveryKey "bff:sports:offer"', () => {
              response.data[0].data[1].discoveryKey.should.eql('bff:sports:offer');
            });
            it('with active status false', () => {
              response.data[0].data[1].active.should.eql(false);
            });
          });
          describe('with correct values for third tab', () => {
            it('with title "Racing"', () => {
              response.data[0].data[2].title.should.eql('Racing');
            });
            it('with offerName "Racing Offers"', () => {
              response.data[0].data[2].offerName.should.eql('Racing Offers');
            });
            it('with discoveryKey "bff:sports:offer"', () => {
              response.data[0].data[2].discoveryKey.should.eql('bff:sports:offer');
            });
            it('with active status true', () => {
              response.data[0].data[2].active.should.eql(true);
            });
            it('with correct data for offer chips', () => {
              response.data[0].data[2].data.should.eql(racingOfferAllData);
            });
          });
        });
      });
    });
    describe('with activeTab value passed as "Racing Retail Offers" when there are no Todays Offers data and only Exotic Offers', () => {
      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:sports').resolves(sportsvenueonly);
        requestCache.fetchInfo.withArgs('info:sport:competiton', {
          sportName: 'Sports Exotics', competitionName: 'Racing Retail Offer', jurisdiction: 'NSW', homeState: '',
        }).resolves(racingretailoffer);

        response = JSON.parse(JSON.stringify(
          await offersController.page(
            {
              query: {
                jurisdiction: 'NSW',
                homeState: '',
                activeTab: 'Racing Retail Offer',
              },
            },
            res,
            next,
          ),
        ));
      });
      it('has type "sports.offers.home"', () => {
        response.type.should.eql('sports.offers.home');
      });
      it('has title "Offers"', () => {
        response.title.should.eql('Offers');
      });

      describe('has data', () => {
        it('with one item', () => {
          response.data.length.should.eql(1);
        });

        it('with type "sports.offers.tabs"', () => {
          response.data[0].type.should.eql('sports.offers.tabs');
        });

        describe('has data', () => {
          it('with 2 items', () => {
            response.data[0].data.length.should.eql(2);
          });
          describe('with correct values for first tab', () => {
            it('with title "Racing"', () => {
              response.data[0].data[0].title.should.eql('Racing');
            });
            it('with offerName "Racing Retail Offer"', () => {
              response.data[0].data[0].offerName.should.eql('Racing Retail Offer');
            });
            it('with discoveryKey "bff:sports:offer"', () => {
              response.data[0].data[0].discoveryKey.should.eql('bff:sports:offer');
            });
            it('with active status false', () => {
              response.data[0].data[0].active.should.eql(true);
            });
            it('with correct data for offer chips', () => {
              response.data[0].data[0].data.should.eql(venueOnlyOffersAllData);
            });
          });
          describe('with correct values for second tab', () => {
            it('with title "Sports"', () => {
              response.data[0].data[1].title.should.eql('Sports');
            });
            it('with offerName "SSports Retail Offer"', () => {
              response.data[0].data[1].offerName.should.eql('Sports Retail Offer');
            });
            it('with discoveryKey "bff:sports:offer"', () => {
              response.data[0].data[1].discoveryKey.should.eql('bff:sports:offer');
            });
            it('with active status false', () => {
              response.data[0].data[1].active.should.eql(false);
            });
          });
        });
      });
    });
    describe('with no activeTab value passed and when there are no Todays Offers data and only Exotic Offers', () => {
      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:sports').resolves(sportsvenueonly);
        requestCache.fetchInfo.withArgs('info:sport:competiton', {
          sportName: 'Sports Exotics', competitionName: 'Racing Retail Offer', jurisdiction: 'NSW', homeState: '',
        }).resolves(racingretailoffer);

        response = JSON.parse(JSON.stringify(
          await offersController.page(
            {
              query: {
                jurisdiction: 'NSW',
                homeState: '',
              },
            },
            res,
            next,
          ),
        ));
      });
      it('has type "sports.offers.home"', () => {
        response.type.should.eql('sports.offers.home');
      });
      it('has title "Offers"', () => {
        response.title.should.eql('Offers');
      });

      describe('has data', () => {
        it('with one item', () => {
          response.data.length.should.eql(1);
        });

        it('with type "sports.offers.tabs"', () => {
          response.data[0].type.should.eql('sports.offers.tabs');
        });

        describe('has data', () => {
          it('with 2 items', () => {
            response.data[0].data.length.should.eql(2);
          });
          describe('with correct values for first tab', () => {
            it('with title "Racing"', () => {
              response.data[0].data[0].title.should.eql('Racing');
            });
            it('with offerName "Racing Retail Offer"', () => {
              response.data[0].data[0].offerName.should.eql('Racing Retail Offer');
            });
            it('with discoveryKey "bff:sports:offer"', () => {
              response.data[0].data[0].discoveryKey.should.eql('bff:sports:offer');
            });
            it('with active status false', () => {
              response.data[0].data[0].active.should.eql(true);
            });
            it('with correct data for offer chips', () => {
              response.data[0].data[0].data.should.eql(venueOnlyOffersAllData);
            });
          });
          describe('with correct values for second tab', () => {
            it('with title "Sports"', () => {
              response.data[0].data[1].title.should.eql('Sports');
            });
            it('with offerName "SSports Retail Offer"', () => {
              response.data[0].data[1].offerName.should.eql('Sports Retail Offer');
            });
            it('with discoveryKey "bff:sports:offer"', () => {
              response.data[0].data[1].discoveryKey.should.eql('bff:sports:offer');
            });
            it('with active status false', () => {
              response.data[0].data[1].active.should.eql(false);
            });
          });
        });
      });
    });
  });
  describe('Offer page response', () => {
    describe('for todays offers and with featured offers', () => {
      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:sports').resolves(sports);
        requestCache.fetchInfo.withArgs('info:sport:competiton', {
          sportName: 'Sports Exotics', competitionName: 'Sports Retail Offer', jurisdiction: 'NSW', homeState: '',
        }).resolves(sportsretailoffer);
        requestCache.fetchInfo.withArgs('info:sport:competiton', {
          sportName: 'Todays Offers', competitionName: 'Sports Offers', jurisdiction: 'NSW', homeState: '',
        }).resolves(sportsoffers);
        requestCache.fetchInfo.withArgs('info:sport:competiton', {
          sportName: 'Sports Exotics', competitionName: 'Featured Offer', jurisdiction: 'NSW', homeState: '',
        }).resolves(featuredoffer);

        response = JSON.parse(JSON.stringify(
          await offersController.offer(
            {
              params: {
                offerName: 'Sports Offers',
              },
              query: {
                jurisdiction: 'NSW',
                homeState: '',
              },
            },
            res,
            next,
          ),
        ));
      });
      it('has type "sports.offers.offer"', () => {
        response.type.should.eql('sports.offers.offer');
      });
      it('has discoveryKey "bff:sports:offer"', () => {
        response.discoveryKey.should.eql('bff:sports:offer');
      });
      describe('has data', () => {
        it('with 1 item', () => {
          response.data.length.should.eql(1);
        });
        it('with type "sports.offers.offer.chips"', () => {
          response.data[0].type.should.eql('sports.offers.offer.chips');
        });
        describe('has data', () => {
          it('with 2 items', () => {
            response.data[0].data.length.should.eql(2);
          });
          describe('for first component "All Offers"', () => {
            it('with title "All Offers"', () => {
              response.data[0].data[0].title.should.eql('All Offers');
            });
            it('with correct data for "All Offers"', () => {
              response.data[0].data[0].data.should.eql(sportsOfferAllDataWithFeatured);
            });
          });
          describe('for second component "Venue Exclusive Offers"', () => {
            it('with title "Venue Exclusive Offers"', () => {
              response.data[0].data[1].title.should.eql('Venue Exclusive Offers');
            });
            it('with filter key values', () => {
              response.data[0].data[1].filter.should.eql({
                key: 'isVenueExclusive',
                value: true,
              });
            });
          });
        });
      });
    });
    describe('for retail only offers and with featured offers', () => {
      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:sports').resolves(sportsvenueonly);
        requestCache.fetchInfo.withArgs('info:sport:competiton', {
          sportName: 'Sports Exotics', competitionName: 'Sports Retail Offer', jurisdiction: 'NSW', homeState: '',
        }).resolves(sportsretailoffer);
        requestCache.fetchInfo.withArgs('info:sport:competiton', {
          sportName: 'Sports Exotics', competitionName: 'Sports Featured Offer', jurisdiction: 'NSW', homeState: '',
        }).resolves(featuredoffer);

        response = JSON.parse(JSON.stringify(
          await offersController.offer(
            {
              params: {
                offerName: 'Sports Retail Offer',
              },
              query: {
                jurisdiction: 'NSW',
                homeState: '',
              },
            },
            res,
            next,
          ),
        ));
      });
      it('has type "sports.offers.offer"', () => {
        response.type.should.eql('sports.offers.offer');
      });
      it('has discoveryKey "bff:sports:offer"', () => {
        response.discoveryKey.should.eql('bff:sports:offer');
      });
      describe('has data', () => {
        it('with 1 item', () => {
          response.data.length.should.eql(1);
        });
        it('with type "sports.offers.offer.chips"', () => {
          response.data[0].type.should.eql('sports.offers.offer.chips');
        });
        describe('has data', () => {
          it('with 2 items', () => {
            response.data[0].data.length.should.eql(2);
          });
          describe('for first component "All Offers"', () => {
            it('with title "All Offers"', () => {
              response.data[0].data[0].title.should.eql('All Offers');
            });
            it('with correct data for "All Offers"', () => {
              response.data[0].data[0].data.should.eql(venueOnlyOfferAllData);
            });
          });
          describe('for second component "Venue Exclusive Offers"', () => {
            it('with title "Venue Exclusive Offers"', () => {
              response.data[0].data[1].title.should.eql('Venue Exclusive Offers');
            });
            it('with filter key values', () => {
              response.data[0].data[1].filter.should.eql({
                key: 'isVenueExclusive',
                value: true,
              });
            });
          });
        });
      });
    });
  });
});
