const sinon = require('sinon');

const allMarketsKecmanovicVBasilashvili = require('../expected-data/tournament-match/markets/kecmanovic-v-basilashvili');
const matchListKecmanovicVBasilashvili = require('../expected-data/tournament-match/match-list/kecmanovic-v-basilashvili');
const resultsBronzettiVErrani = require('../expected-data/tournament-match/results/bronzetti-v-errani');
const promoVisibility = require('../mocks/aem/sport.promo.visbility.json');
const kecmanovicVBasilashvili = require('../mocks/info-wift/matches/kecmanovic-v-basilashvili.json');
const bronzettiVErraniResults = require('../mocks/info-wift/results/bronzetti-v-errani.json');
const atpMunichMatches = require('../mocks/info-wift/tournaments/atp-munich-matches.json');

const tournamentMatchController = require(`${global.SRC}/controllers/tournament-match`);
const log = require(`${global.SRC}/log`);
const requestCache = require(`${global.SRC}/request-cache`);
const request = require(`${global.SRC}/request`);
const launchDarklyService = require(`${global.SRC}/launch-darkly`);

describe('Tournament Match controller', () => {
  const req = {
    params: {
      sportName: 'Tennis',
      competitionName: 'WTA',
      tournamentName: 'WTA Monterrey',
      matchName: 'Bronzetti v Errani',
    },
    query: {
      jurisdiction: 'QLD',
    },
  };

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
    sinon.stub(requestCache, 'fetchAem');
    sinon.stub(request, 'get').resolves([]);
    sinon.stub(launchDarklyService, 'isTrendingSGMBetsEnabled').returns(false);
  });

  describe('Page response', () => {
    describe('for Kecmanovic v Basilashvili', () => {
      const tournamentName = 'ATP Munich';
      const matchName = 'Kecmanovic v Basilashvili';

      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:tournament:matches').resolves(atpMunichMatches);
        requestCache.fetchInfo.withArgs('info:tournament:match').resolves(kecmanovicVBasilashvili);
        requestCache.fetchAem.withArgs('promo').resolves(promoVisibility);

        response = JSON.parse(JSON.stringify(
          await tournamentMatchController.page(
            {
              params: {
                sportName: 'Tennis',
                competitionName: 'ATP',
                tournamentName,
                matchName,
              },
              query: {
                jurisdiction: 'QLD',
              },
            },
            res,
            next,
          ),
        ));
      });

      it('has type "sports.sport.match"', () => {
        response.type.should.eql('sports.sport.match');
      });

      describe('has data', () => {
        it('with five components', () => {
          response.data.length.should.eql(5);
        });

        describe('the first component', () => {
          it('has type "sports.match.list"', () => {
            response.data[0].type.should.eql('sports.match.list');
          });

          it('has title [Match Name]', () => {
            response.data[0].title.should.eql(matchName);
          });

          it('has correct data', () => {
            response.data[0].data.should.eql(matchListKecmanovicVBasilashvili);
          });
        });

        describe('the second component', () => {
          it('has type "sports.match.header"', () => {
            response.data[1].type.should.eql('sports.match.header');
          });

          it('has title [Tournament Name]', () => {
            response.data[1].title.should.eql(tournamentName);
          });

          it('has correct display time', () => {
            response.data[1].displayTime.should.eql(kecmanovicVBasilashvili.markets[0].closeTime);
          });

          it('has correct start time', () => {
            response.data[1].startTime.should.eql(kecmanovicVBasilashvili.startTime);
          });

          it('has correct in-play flag', () => {
            response.data[1].inPlay.should.eql(kecmanovicVBasilashvili.inPlay);
          });

          it('has correct icon', () => {
            response.data[1].icon.appIconIdentifier.should.eql('tennis');
          });
        });

        describe('the third component', () => {
          it('has type "sports.match.media"', () => {
            response.data[2].type.should.eql('sports.match.media');
          });

          it('has sports style display', () => {
            response.data[2].collapsible.should.eql(true);
            response.data[2].isCollapsed.should.eql(true);
            response.data[2].autoPlay.should.eql(false);
            response.data[2].showWatchButton.should.eql(true);
            response.data[2].showPreviewButton.should.eql(false);
          });

          it('has vision only data', () => {
            response.data[2].data.length.should.eql(1);
            response.data[2].data[0].type.should.eql('sports.match.vision');
          });

          it('has 1 valid visualisation object', () => {
            response.data[2].data[0].data.length.should.eql(1);
            response.data[2].data[0].data[0].mediaType.should.eql('visualisation');
            response.data[2].data[0].data[0].provider.should.eql('betRadar');
            response.data[2].data[0].data[0].content.should.eql({
              matchId: '33275715',
              embeddedPages: [
                {
                  url: 'https://api.beta.tab.com.au/v1/vision-service/tab/providers/betradar/embed/33275715',
                  mobile: {
                    url: 'https://api.beta.tab.com.au/v1/vision-service/tab/providers/betradar/embed/33275715?layout=single&momentum=disable',
                    width: 420,
                    height: 333,
                  },
                },
              ],
            });
          });
        });

        describe('the fives component', () => {
          it('has type "sports.match.tabs"', () => {
            response.data[4].type.should.eql('sports.match.tabs');
          });

          describe('has data', () => {
            it('with one tab', () => {
              response.data[4].data.length.should.eql(1);
            });

            describe('the tab', () => {
              it('has title "All Markets"', () => {
                response.data[4].data[0].title.should.eql('All Markets');
              });

              it('has tab "all"', () => {
                response.data[4].data[0].tab.should.eql('all');
              });

              it('is active', () => {
                response.data[4].data[0].active.should.eql(true);
              });

              it('has discoveryKey "bff:sports:tournament-match:markets"', () => {
                response.data[4].data[0].discoveryKey.should.eql('bff:sports:tournament-match:markets');
              });

              describe('has data', () => {
                it('with one component', () => {
                  response.data[4].data[0].data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    response.data[4].data[0].data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    response.data[4].data[0].data[0].data
                      .should.eql(allMarketsKecmanovicVBasilashvili);
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('when info-wift throws an error', () => {
      beforeEach(async () => {
        sinon.stub(log, 'error').callsFake(() => {});

        requestCache.fetchInfo.throws();

        response = JSON.parse(JSON.stringify(
          await tournamentMatchController.page(
            {
              params: {
                sportName: 'sport',
                competitionName: 'competition',
                matchName: 'match',
              },
              query: {
                jurisdiction: 'QLD',
              },
            },
            res,
            next,
          ),
        ));
      });

      it('logs the error', () => {
        sinon.assert.called(log.error);
      });

      it('returns error response', () => {
        response.should.eql({
          error: {
            code: 'SERVER_ERROR',
            message: 'Server encountered an Error.',
          },
        });
      });
    });
  });

  describe('Markets response', () => {
    describe('for Kecmanovic v Basilashvili', () => {
      const tournamentName = 'ATP Munich';
      const matchName = 'Kecmanovic v Basilashvili';

      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:tournament:matches').resolves(atpMunichMatches);
        requestCache.fetchInfo.withArgs('info:tournament:match').resolves(kecmanovicVBasilashvili);

        response = JSON.parse(JSON.stringify(
          await tournamentMatchController.markets(
            {
              params: {
                sportName: 'Tennis',
                competitionName: 'ATP',
                tournamentName,
                matchName,
              },
              query: {
                jurisdiction: 'QLD',
              },
            },
            res,
            next,
          ),
        ));
      });

      it('has type "sports.match.markets"', () => {
        response.type.should.eql('sports.match.markets');
      });

      it('has the correct data', () => {
        response.data.should.eql(allMarketsKecmanovicVBasilashvili);
      });
    });

    describe('when info-wift throws an error', () => {
      beforeEach(async () => {
        sinon.stub(log, 'error').callsFake(() => {});

        requestCache.fetchInfo.throws();

        response = JSON.parse(JSON.stringify(
          await tournamentMatchController.page(
            {
              params: {
                sportName: 'sport',
                competitionName: 'competition',
                matchName: 'match',
              },
              query: {
                jurisdiction: 'QLD',
              },
            },
            res,
            next,
          ),
        ));
      });

      it('logs the error', () => {
        sinon.assert.called(log.error);
      });

      it('returns error response', () => {
        response.should.eql({
          error: {
            code: 'SERVER_ERROR',
            message: 'Server encountered an Error.',
          },
        });
      });
    });
  });

  describe('Same Game Multi response', () => {
    describe('for a match with no SGM markets', () => {
      const tournamentName = 'ATP Munich';
      const matchName = 'Kecmanovic v Basilashvili';

      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:tournament:matches').resolves(atpMunichMatches);
        requestCache.fetchInfo.withArgs('info:tournament:match').resolves(kecmanovicVBasilashvili);

        response = JSON.parse(JSON.stringify(
          await tournamentMatchController.sameGameMulti(
            {
              params: {
                sportName: 'Tennis',
                competitionName: 'ATP',
                tournamentName,
                matchName,
              },
              query: {
                jurisdiction: 'QLD',
              },
            },
            res,
            next,
          ),
        ));
      });

      it('has type "sports.match.markets"', () => {
        response.type.should.eql('sports.match.markets');
      });

      it('has empty data', () => {
        response.data.should.eql([]);
      });
    });

    describe('when info-wift throws an error', () => {
      beforeEach(async () => {
        sinon.stub(log, 'error').callsFake(() => {});

        requestCache.fetchInfo.throws();

        response = JSON.parse(JSON.stringify(
          await tournamentMatchController.page(
            {
              params: {
                sportName: 'sport',
                competitionName: 'competition',
                matchName: 'match',
              },
              query: {
                jurisdiction: 'QLD',
              },
            },
            res,
            next,
          ),
        ));
      });

      it('logs the error', () => {
        sinon.assert.called(log.error);
      });

      it('returns error response', () => {
        response.should.eql({
          error: {
            code: 'SERVER_ERROR',
            message: 'Server encountered an Error.',
          },
        });
      });
    });
  });

  describe('Results response', () => {
    describe('for Bronzetti v Errani', () => {
      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:tournament:match:markets:results').resolves(bronzettiVErraniResults);

        response = JSON.parse(JSON.stringify(
          await tournamentMatchController.results(req, res, next),
        ));
      });

      it('has type "sports.match.results"', () => {
        response.type.should.eql('sports.match.results');
      });

      it('has title "[Match Name]"', () => {
        response.title.should.eql('Bronzetti v Errani');
      });

      it('has discovery key "bff:sports:tournament-match:results"', () => {
        response.discoveryKey.should.eql('bff:sports:tournament-match:results');
      });

      describe('has data', () => {
        it('with the same number of markets as the info service response', () => {
          response.data.length.should.eql(bronzettiVErraniResults.markets.length);
        });

        it('with the correct markets', () => {
          response.data.should.eql(resultsBronzettiVErrani);
        });
      });
    });
  });

  describe('when info-wift throws an error', () => {
    beforeEach(async () => {
      sinon.stub(log, 'error').callsFake(() => {});

      requestCache.fetchInfo.throws();

      response = JSON.parse(JSON.stringify(
        await tournamentMatchController.results(req, res, next),
      ));
    });

    it('logs the error', () => {
      sinon.assert.called(log.error);
    });

    it('returns error response', () => {
      response.should.eql({
        error: {
          code: 'SERVER_ERROR',
          message: 'Error fetching tournament match results.',
        },
      });
    });
  });
});
