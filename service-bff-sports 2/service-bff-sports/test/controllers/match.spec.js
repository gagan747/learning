const should = require('should');
const sinon = require('sinon');

const allMarketsGSWvBos = require('../expected-data/match/markets/golden-state-v-boston');
const allMarketsHanshinVChunichi = require('../expected-data/match/markets/hanshin-v-chunichi');
const allMarketsNewcastleVMelbourne = require('../expected-data/match/markets/newcastle-v-melbourne');
const allMarketsNextFederalElection = require('../expected-data/match/markets/next-federal-election');
const allMarketsShimizuVFCTokyo = require('../expected-data/match/markets/shimizu-v-fc-tokyo');
const allMarketsSydneyVBrisbane = require('../expected-data/match/markets/sydney-v-brisbane');
const matchListHanshinVChunichi = require('../expected-data/match/match-list/hanshin-v-chunichi');
const matchListNewcastleVMelbourne = require('../expected-data/match/match-list/newcastle-v-melbourne');
const matchListNextFederalElection = require('../expected-data/match/match-list/next-federal-election');
const matchListShimizuVFCTokyo = require('../expected-data/match/match-list/shimizu-v-fc-tokyo');
const matchListSydneyVBrisbane = require('../expected-data/match/match-list/sydney-v-brisbane');
const sgmMarketsGSWvBos = require('../expected-data/match/same-game-multi/golden-state-v-boston');
const sgmMarketsNewcastleVMelbourne = require('../expected-data/match/same-game-multi/newcastle-v-melbourne');
const sgmMarketsShimizuVFCTokyo = require('../expected-data/match/same-game-multi/shimizu-v-fc-tokyo');
const sgmMarketsSydneyVBrisbane = require('../expected-data/match/same-game-multi/sydney-v-brisbane');
const detVDalH2H = require('../expected-data/match/stats/detroit-v-dallas-h2h.json');
const detVDalLine = require('../expected-data/match/stats/detroit-v-dallas-line.json');
const detVDalLineMarketNew = require('../expected-data/match/stats/nba/detroit-v-dallas-line-market-new.json');
const detVDalLineMarketOld = require('../expected-data/match/stats/nba/detroit-v-dallas-line-market-old.json');
const detVDalResultMarketDiff = require('../expected-data/match/stats/nba/detroit-v-dallas-result-market-diff.json');
const detVDalResultMarketSame = require('../expected-data/match/stats/nba/detroit-v-dallas-result-market-same.json');
const shimizuVFCTokyoTrendingBets = require('../expected-data/match/trending-sgm-bets/shimizu-v-fc-tokyo');
const shimizuVFCTokyoTrendingBetsMissingPropIds = require('../expected-data/match/trending-sgm-bets/shimizu-v-fc-tokyo-missing-prop-ids');
const promoVisibility = require('../mocks/aem/sport.promo.visbility.json');
const aflMatches = require('../mocks/info-wift/competitions/afl-matches.json');
const australianFederalPoliticsMatches = require('../mocks/info-wift/competitions/australian-federal-politics-matches.json');
const euroLeagueMatches = require('../mocks/info-wift/competitions/euro-league-matches.json');
const japanJ1LeagueMatches = require('../mocks/info-wift/competitions/japan-j1-league-matches.json');
const japaneseBaseballLeagueMatches = require('../mocks/info-wift/competitions/japanese-baseball-league-matches.json');
const nbaMatches = require('../mocks/info-wift/competitions/nba-matches.json');
const nrlMatches = require('../mocks/info-wift/competitions/nrl-matches.json');
const wnbaMatches = require('../mocks/info-wift/competitions/wnba-matches.json');
const detVDalMatch = require('../mocks/info-wift/matches/detroit-v-dallas.json');
const previewGoldenVBoston = require('../mocks/info-wift/matches/golden-v-boston-preview.json');
const visionGoldenVBoston = require('../mocks/info-wift/matches/golden-v-boston-vision.json');
const goldenVBoston = require('../mocks/info-wift/matches/golden-v-boston.json');
const hanshinVChunichi = require('../mocks/info-wift/matches/hanshin-v-chunichi.json');
const newcastleVMelbourne = require('../mocks/info-wift/matches/newcastle-v-melbourne.json');
const nextFederalElection = require('../mocks/info-wift/matches/next-federal-election.json');
const partizanvlyanInPlay = require('../mocks/info-wift/matches/partizan-v-asvel-lyon.json');
const shimizuVFcTokyo = require('../mocks/info-wift/matches/shimizu-v-fc-tokyo.json');
const sydneyVBrisbane = require('../mocks/info-wift/matches/sydney-v-brisbane.json');
const statsError = require('../mocks/stats/error.json');
const matchup = require('../mocks/stats/matchup.json');
const detVDalMatchupSuccess = require('../mocks/stats/nba/detroit-v-dallas-matchup-success.json');
const detVDalStandingsSuccessDiff = require('../mocks/stats/nba/detroit-v-dallas-standings-success-diff.json');
const detVDalStandingsSuccessSame = require('../mocks/stats/nba/detroit-v-dallas-standings-success-same.json');
const table = require('../mocks/stats/table.json');

const config = require(`${global.SRC}/config`);
const matchController = require(`${global.SRC}/controllers/match`);
const log = require(`${global.SRC}/log`);
const requestCache = require(`${global.SRC}/request-cache`);
const request = require(`${global.SRC}/request`);
const launchDarklyService = require(`${global.SRC}/launch-darkly`);

describe('Match controller', () => {
  const {
    contentHubService,
    dynamicConfig,
    infoService,
    launchDarkly,
    statsService,
    trendingBetsService,
  } = config.get();

  const res = {
    json: (args) => args,
    status: (args) => args,
  };

  const next = () => { };

  let response;
  let component;
  let tab;
  let launchDarklyTrendingSGMBetsEnabledStub;
  let launchDarklyTrendingSGMGropuDisplayIndexStub;
  let market;

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    sinon.stub(config, 'get');
    sinon.stub(config, 'getDynamicConfig');
    sinon.stub(requestCache, 'fetchInfo');
    sinon.stub(requestCache, 'fetchAem');
    sinon.stub(requestCache, 'fetchContentHub');
    sinon.stub(request, 'get');
    sinon.stub(requestCache, 'fetchStats');

    launchDarklyTrendingSGMBetsEnabledStub = sinon.stub(launchDarklyService, 'isTrendingSGMBetsEnabled');
    launchDarklyTrendingSGMGropuDisplayIndexStub = sinon.stub(launchDarklyService, 'getTrendingSGMGroupDisplayIndex');

    config.get.returns({
      infoService,
      contentHubService,
      launchDarkly,
      statsService,
      trendingBetsService,
    });

    config.getDynamicConfig.returns({
      ...dynamicConfig,
      toggles: {
        enableSGM: true,
        enableMatchCarousel: true,
        enableSGMforAllMarkets: true,
      },
      matchCarouselChannels: ['NBA'],
      defaultMatchCarouselImages: {
        NBA: ['some.url/nba1.png', 'some.url/nba2.png'],
      },
    });
  });

  describe('Page response', () => {
    describe('for a match with same game multi markets and bet option groups and at least 10 markets', () => {
      const competitionName = 'Japan J1 League';
      const matchName = 'Shimizu v FC Tokyo';

      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:competiton:matches').resolves(japanJ1LeagueMatches);
        requestCache.fetchInfo.withArgs('info:competiton:match').resolves(shimizuVFcTokyo);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Soccer',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'QLD',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('has type "sports.sport.match"', () => {
        response.type.should.eql('sports.sport.match');
      });

      describe('has data', () => {
        it('with five components', () => {
          response.data.length.should.eql(5);
        });

        describe('the first component', () => {
          beforeEach(() => {
            [component] = response.data;
          });

          it('has type "sports.match.list"', () => {
            component.type.should.eql('sports.match.list');
          });

          it('has title [Match Name]', () => {
            component.title.should.eql(matchName);
          });

          it('has correct data', () => {
            component.data.should.eql(matchListShimizuVFCTokyo);
          });
        });

        describe('the second component', () => {
          beforeEach(() => {
            [, component] = response.data;
          });

          it('has type "sports.match.header"', () => {
            component.type.should.eql('sports.match.header');
          });

          it('has title [Competition Name]', () => {
            component.title.should.eql(competitionName);
          });

          it('has correct display time', () => {
            component.displayTime.should.eql(shimizuVFcTokyo.markets[0].closeTime);
          });

          it('has correct start time', () => {
            component.startTime.should.eql(shimizuVFcTokyo.startTime);
          });

          it('has correct in-play flag', () => {
            component.inPlay.should.eql(shimizuVFcTokyo.inPlay);
          });

          it('has correct icon', () => {
            component.icon.appIconIdentifier.should.eql('soccer');
          });
        });

        describe('the third component', () => {
          beforeEach(() => {
            component = response.data[2];
          });

          it('has type "sports.match.media"', () => {
            component.type.should.eql('sports.match.media');
          });

          it('has sports style display', () => {
            component.collapsible.should.eql(true);
            component.isCollapsed.should.eql(true);
            component.autoPlay.should.eql(false);
            component.showWatchButton.should.eql(true);
            component.showPreviewButton.should.eql(false);
          });

          it('has vision only data', () => {
            component.data.length.should.eql(1);
            component.data[0].type.should.eql('sports.match.vision');
          });

          it('has 1 valid visualisation object', () => {
            component.data[0].data.length.should.eql(1);
            component.data[0].data[0].mediaType.should.eql('visualisation');
            component.data[0].data[0].provider.should.eql('performVisualisation');
            component.data[0].data[0].content.should.eql({
              _links: {
                self: 'https://api.beta.tab.com.au/v1/vision-service/tab-act/matches/ShmzvFCTk/performVisualisation',
              },
              eventId: 'by574nwoq3d1wg7eq5s1gjris',
              requiresAuthentication: false,
              startTime: '2022-05-25T10:00:00Z',
            });
          });
        });

        describe('the fourth component', () => {
          beforeEach(() => {
            component = response.data[3];
          });

          it('has type "sports.match.media.buttons"', () => {
            component.type.should.eql('sports.match.media.buttons');
          });

          it('has sports style display', () => {
            component.buttons.showWatchButton.should.eql(true);
            component.buttons.showPreviewButton.should.eql(false);
          });
        });

        describe('the fifth component', () => {
          beforeEach(() => {
            component = response.data[4];
          });

          it('has type "sports.match.tabs"', () => {
            component.type.should.eql('sports.match.tabs');
          });

          describe('has data', () => {
            it('with two tabs', () => {
              component.data.length.should.eql(2);
            });

            describe('the first tab', () => {
              beforeEach(() => {
                [tab] = component.data;
              });

              it('has title "All Markets"', () => {
                tab.title.should.eql('All Markets');
              });

              it('has tab "all"', () => {
                tab.tab.should.eql('all');
              });

              it('is active', () => {
                tab.active.should.eql(true);
              });

              it('has discovery key "bff:sports:match:markets"', () => {
                tab.discoveryKey.should.eql('bff:sports:match:markets');
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    tab.data[0].data.should.eql(allMarketsShimizuVFCTokyo);
                  });
                });
              });
            });

            describe('the second tab', () => {
              beforeEach(() => {
                [, tab] = component.data;
              });

              it('has title "Same Game Multi"', () => {
                tab.title.should.eql('Same Game Multi');
              });

              it('has tab "sgm"', () => {
                tab.tab.should.eql('sgm');
              });

              it('is not active', () => {
                tab.active.should.eql(false);
              });

              it('has discovery key "bff:sports:match:same-game-multi"', () => {
                tab.discoveryKey.should.eql('bff:sports:match:same-game-multi');
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    tab.data[0].data.should.eql(sgmMarketsShimizuVFCTokyo);
                  });
                });
              });
            });
          });

          describe('if SGM is disabled', () => {
            beforeEach(async () => {
              config.getDynamicConfig.returns({
                ...dynamicConfig,
                toggles: {
                  enableSGM: false,
                },
              });

              response = JSON.parse(
                JSON.stringify(
                  await matchController.page(
                    {
                      params: {
                        sportName: 'Soccer',
                        competitionName,
                        matchName,
                      },
                      query: {
                        jurisdiction: 'QLD',
                      },
                    },
                    res,
                    next,
                  ),
                ),
              );

              component = response.data[4];
            });

            it('has one tab', () => {
              component.data.length.should.eql(1);
            });

            it('with title "All Markets"', () => {
              component.data[0].title.should.eql('All Markets');
            });
          });
        });
      });
    });

    describe('for a match with same game multi markets and bet option groups and fewer than 10 markets', () => {
      const competitionName = 'AFL';
      const matchName = 'Sydney v Brisbane';

      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:competiton:matches').resolves(aflMatches);
        requestCache.fetchInfo.withArgs('info:competiton:match').resolves(sydneyVBrisbane);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'AFL Football',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'QLD',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('has type "sports.sport.match"', () => {
        response.type.should.eql('sports.sport.match');
      });

      describe('has data', () => {
        it('with three components', () => {
          response.data.length.should.eql(3);
        });

        describe('the first component', () => {
          beforeEach(() => {
            [component] = response.data;
          });

          it('has type "sports.match.list"', () => {
            component.type.should.eql('sports.match.list');
          });

          it('has title [Match Name]', () => {
            component.title.should.eql(matchName);
          });

          it('has correct data', () => {
            component.data.should.eql(matchListSydneyVBrisbane);
          });
        });

        describe('the second component', () => {
          beforeEach(() => {
            [, component] = response.data;
          });

          it('has type "sports.match.header"', () => {
            component.type.should.eql('sports.match.header');
          });

          it('has title [Competition Name]', () => {
            component.title.should.eql(competitionName);
          });

          it('has correct display time', () => {
            component.displayTime.should.eql(sydneyVBrisbane.markets[0].closeTime);
          });

          it('has correct start time', () => {
            component.startTime.should.eql(sydneyVBrisbane.startTime);
          });

          it('has correct in-play flag', () => {
            component.inPlay.should.eql(sydneyVBrisbane.inPlay);
          });

          it('has correct icon', () => {
            component.icon.appIconIdentifier.should.eql('afl_football');
          });
        });

        describe('the third component', () => {
          beforeEach(() => {
            component = response.data[2];
          });

          it('has type "sports.match.tabs"', () => {
            component.type.should.eql('sports.match.tabs');
          });

          describe('has data', () => {
            it('with two tabs', () => {
              component.data.length.should.eql(2);
            });

            describe('the first tab', () => {
              beforeEach(() => {
                [tab] = component.data;
              });

              it('has title "All Markets"', () => {
                tab.title.should.eql('All Markets');
              });

              it('has tab "all"', () => {
                tab.tab.should.eql('all');
              });

              it('is active', () => {
                tab.active.should.eql(true);
              });

              it('has discovery key "bff:sports:match:markets"', () => {
                tab.discoveryKey.should.eql('bff:sports:match:markets');
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    tab.data[0].data.should.eql(allMarketsSydneyVBrisbane);
                  });
                });
              });
            });

            describe('the second tab', () => {
              beforeEach(() => {
                [, tab] = component.data;
              });

              it('has title "Same Game Multi"', () => {
                tab.title.should.eql('Same Game Multi');
              });

              it('has tab "sgm"', () => {
                tab.tab.should.eql('sgm');
              });

              it('is not active', () => {
                tab.active.should.eql(false);
              });

              it('has discovery key "bff:sports:match:same-game-multi"', () => {
                tab.discoveryKey.should.eql('bff:sports:match:same-game-multi');
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    tab.data[0].data.should.eql(sgmMarketsSydneyVBrisbane);
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('for a match without same game multi markets and bet option groups', () => {
      const competitionName = 'Australian Federal Politics';
      const matchName = 'Next Federal Election';

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches')
          .resolves(australianFederalPoliticsMatches);
        requestCache.fetchInfo.withArgs('info:competiton:match').resolves(nextFederalElection);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Politics',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'NSW',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('has type "sports.sport.match"', () => {
        response.type.should.eql('sports.sport.match');
      });

      describe('has data', () => {
        it('with three components', () => {
          response.data.length.should.eql(3);
        });

        describe('the first component', () => {
          beforeEach(() => {
            [component] = response.data;
          });

          it('has type "sports.match.list"', () => {
            component.type.should.eql('sports.match.list');
          });

          it('has title [Match Name]', () => {
            component.title.should.eql(matchName);
          });

          it('has correct data', () => {
            component.data.should.eql(matchListNextFederalElection);
          });
        });

        describe('the second component', () => {
          beforeEach(() => {
            [, component] = response.data;
          });

          it('has type "sports.match.header"', () => {
            component.type.should.eql('sports.match.header');
          });

          it('has title [Competition Name]', () => {
            component.title.should.eql(competitionName);
          });

          it('has correct display time', () => {
            component.displayTime.should.eql(nextFederalElection.markets[0].closeTime);
          });

          it('has correct start time', () => {
            component.startTime.should.eql(nextFederalElection.startTime);
          });

          it('has correct onlineBetting flag', () => {
            component.onlineBetting.should.eql(nextFederalElection.markets[0].onlineBetting);
          });

          it('has correct phoneBettingOnly flag', () => {
            component.phoneBettingOnly.should.eql(nextFederalElection.markets[0].phoneBettingOnly);
          });

          it('has correct in-play flag', () => {
            component.inPlay.should.eql(nextFederalElection.inPlay);
          });

          it('has correct icon', () => {
            component.icon.appIconIdentifier.should.eql('politics');
          });
        });

        describe('the third component', () => {
          beforeEach(() => {
            component = response.data[2];
          });

          it('has type "sports.match.tabs"', () => {
            component.type.should.eql('sports.match.tabs');
          });

          describe('has data', () => {
            it('with one tab', () => {
              component.data.length.should.eql(1);
            });

            describe('the tab', () => {
              beforeEach(() => {
                [tab] = component.data;
              });

              it('has title "All Markets"', () => {
                tab.title.should.eql('All Markets');
              });

              it('has tab "all"', () => {
                tab.tab.should.eql('all');
              });

              it('is active', () => {
                tab.active.should.eql(true);
              });

              it('has discoveryKey "bff:sports:match:markets"', () => {
                tab.discoveryKey.should.eql('bff:sports:match:markets');
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    tab.data[0].data.should.eql(allMarketsNextFederalElection);
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('for a match with same game multi markets but without bet option groups', () => {
      const competitionName = 'NRL';
      const matchName = 'Newcastle v Melbourne';

      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:competiton:matches').resolves(nrlMatches);
        requestCache.fetchInfo.withArgs('info:competiton:match').resolves(newcastleVMelbourne);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Rugby League',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'QLD',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('has type "sports.sport.match"', () => {
        response.type.should.eql('sports.sport.match');
      });

      describe('has data', () => {
        it('with three components', () => {
          response.data.length.should.eql(3);
        });

        describe('the first component', () => {
          beforeEach(() => {
            [component] = response.data;
          });

          it('has type "sports.match.list"', () => {
            component.type.should.eql('sports.match.list');
          });

          it('has title [Match Name]', () => {
            component.title.should.eql(matchName);
          });

          it('has correct data', () => {
            component.data.should.eql(matchListNewcastleVMelbourne);
          });
        });

        describe('the second component', () => {
          beforeEach(() => {
            [, component] = response.data;
          });

          it('has type "sports.match.header"', () => {
            component.type.should.eql('sports.match.header');
          });

          it('has title [Competition Name]', () => {
            component.title.should.eql(competitionName);
          });

          it('has correct display time', () => {
            component.displayTime.should.eql(newcastleVMelbourne.markets[0].closeTime);
          });

          it('has correct start time', () => {
            component.startTime.should.eql(newcastleVMelbourne.startTime);
          });

          it('has correct in-play flag', () => {
            component.inPlay.should.eql(newcastleVMelbourne.inPlay);
          });

          it('has correct icon', () => {
            component.icon.appIconIdentifier.should.eql('rugby_league');
          });
        });

        describe('the third component', () => {
          beforeEach(() => {
            component = response.data[2];
          });

          it('has type "sports.match.tabs"', () => {
            component.type.should.eql('sports.match.tabs');
          });

          describe('has data', () => {
            it('with two tabs', () => {
              component.data.length.should.eql(2);
            });

            describe('the first tab', () => {
              beforeEach(() => {
                [tab] = component.data;
              });

              it('has title "All Markets"', () => {
                tab.title.should.eql('All Markets');
              });

              it('has tab "all"', () => {
                tab.tab.should.eql('all');
              });

              it('is active', () => {
                tab.active.should.eql(true);
              });

              it('has discovery key "bff:sports:match:markets"', () => {
                tab.discoveryKey.should.eql('bff:sports:match:markets');
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    tab.data[0].data.should.eql(allMarketsNewcastleVMelbourne);
                  });
                });
              });
            });

            describe('the second tab', () => {
              beforeEach(() => {
                [, tab] = component.data;
              });

              it('has title "Same Game Multi"', () => {
                tab.title.should.eql('Same Game Multi');
              });

              it('has tab "sgm"', () => {
                tab.tab.should.eql('sgm');
              });

              it('is not active', () => {
                tab.active.should.eql(false);
              });

              it('has discovery key "bff:sports:match:same-game-multi"', () => {
                tab.discoveryKey.should.eql('bff:sports:match:same-game-multi');
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    tab.data[0].data.should.eql(sgmMarketsNewcastleVMelbourne);
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('for a match without same game multi markets and fewer than 10 markets', () => {
      const competitionName = 'Japanese Baseball League';
      const matchName = 'Hanshin v Chunichi';

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches')
          .resolves(japaneseBaseballLeagueMatches);
        requestCache.fetchInfo.withArgs('info:competiton:match').resolves(hanshinVChunichi);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Baseball',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'QLD',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('has type "sports.sport.match"', () => {
        response.type.should.eql('sports.sport.match');
      });

      describe('has data', () => {
        it('with five components', () => {
          response.data.length.should.eql(5);
        });

        describe('the first component', () => {
          beforeEach(() => {
            [component] = response.data;
          });

          it('has type "sports.match.list"', () => {
            component.type.should.eql('sports.match.list');
          });

          it('has title [Match Name]', () => {
            component.title.should.eql(matchName);
          });

          it('has correct data', () => {
            component.data.should.eql(matchListHanshinVChunichi);
          });
        });

        describe('the second component', () => {
          beforeEach(() => {
            [, component] = response.data;
          });

          it('has type "sports.match.header"', () => {
            component.type.should.eql('sports.match.header');
          });

          it('has title [Competition Name]', () => {
            component.title.should.eql(competitionName);
          });

          it('has correct display time', () => {
            component.displayTime.should.eql(hanshinVChunichi.markets[0].closeTime);
          });

          it('has correct start time', () => {
            component.startTime.should.eql(hanshinVChunichi.startTime);
          });

          it('has correct in-play flag', () => {
            component.inPlay.should.eql(hanshinVChunichi.inPlay);
          });

          it('has correct icon', () => {
            component.icon.appIconIdentifier.should.eql('baseball');
          });
        });

        describe('the fifth component', () => {
          beforeEach(() => {
            component = response.data[4];
          });

          it('has type "sports.match.tabs"', () => {
            component.type.should.eql('sports.match.tabs');
          });

          describe('has data', () => {
            it('with one tab', () => {
              component.data.length.should.eql(1);
            });

            describe('the tab', () => {
              beforeEach(() => {
                [tab] = component.data;
              });

              it('has title "All Markets"', () => {
                tab.title.should.eql('All Markets');
              });

              it('has tab "all"', () => {
                tab.tab.should.eql('all');
              });

              it('is active', () => {
                tab.active.should.eql(true);
              });

              it('has discoveryKey "bff:sports:match:markets"', () => {
                tab.discoveryKey.should.eql('bff:sports:match:markets');
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    tab.data[0].data.should.eql(allMarketsHanshinVChunichi);
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('for a match with Promo visibilty', () => {
      const competitionName = 'NCAA Basketball';
      const matchName = 'Golden State v Boston';

      beforeEach(async () => {
        sinon.useFakeTimers(Date.parse('2022-09-09T00:00:00.000Z'));
        requestCache.fetchInfo.withArgs('info:competiton:matches').resolves(wnbaMatches);
        requestCache.fetchInfo
          .withArgs('info:competiton:match')
          .resolves({ ...goldenVBoston, inPlay: true });
        requestCache.fetchAem.withArgs('promo').resolves(promoVisibility);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Basketball',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'VIC',
                  version: '12.1.0',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('has type "sports.sport.match"', () => {
        response.type.should.eql('sports.sport.match');
      });

      describe('has data', () => {
        it('with six items', () => {
          response.data.length.should.eql(6);
        });

        describe('first item', () => {
          it('has type "sports.competition.list"', () => {
            response.data[0].type.should.eql('sports.match.list');
          });

          it('has title "Golden State v Boston"', () => {
            response.data[0].title.should.eql(matchName);
          });
        });

        describe('second item', () => {
          it('has type "sports.match.promo"', () => {
            response.data[1].type.should.eql('sports.match.promo');
          });

          it('has data', () => {
            response.data[1].data[0].promoText.should.eql('4+ Legs, 1 Fails');
            response.data[1].data[0].should.eql({
              icon: {
                appIconIdentifier: 'app_promo_offers',
                imageURL: '',
                keepOriginalColor: true,
              },
              promoText: '4+ Legs, 1 Fails',
              promoDetails:
                '<!DOCTYPE html><html><head><meta http-equiv="content-type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><script type="text/javascript">function invokeNative(){if (MessageInvoker && typeof MessageInvoker.postMessage === \'function\'){MessageInvoker.postMessage(\'Bet now\');}}</script><style>html{box-sizing:border-box;font-family:\'Inter\',sans-serif;font-size:16px;font-style:normal;}*,*:before,*:after{box-sizing:inherit;}body{display:flex;flex-direction:column;margin:0;min-height:100vh;}img{display:block;height:auto;max-width:100%;}.content{color:rgba(51,51,51,0.69);flex:1;font-weight:400;margin:2rem 1rem 1rem 1rem;}.footer{background:#ffffff;bottom:0;padding:1.5rem 1rem 1rem 1rem;position:sticky;width:100%;}.learn-more{margin-bottom:3.75rem;text-align:center;}.terms{font-size:0.75rem;line-height:1rem;}.bet-now{background:#008542;border:none;border-radius:6px;color:#ffffff;font-size:1rem;font-weight:600;line-height:1.25rem;padding:0.75rem 1rem;width:100%;}.learn-more-title{color:#191919;font-size:1.25rem;font-weight:600;line-height:1.5rem;margin-bottom:1rem;}.learn-more-details{font-size:1rem;line-height:1.25rem;}.terms-title{font-weight:600;margin-bottom:0.5rem;}</style></head><body><img src="https:&#x2F;&#x2F;congo.cmsapi.tab.com.au&#x2F;content&#x2F;dam&#x2F;tab-digital&#x2F;job-number---campaign-name&#x2F;owned&#x2F;promo-visibility&#x2F;8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg" /><div class="content"><div class="learn-more"><div class="learn-more-title">NFL Head to Head Offer</div><div class="learn-more-details">Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,..&#x2F;;&#39;]]\\&#x3D;-&#x60;1adsfasdfaasTips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.</div></div><div class="terms"><div class="terms-title">Terms & Conditions</div><div>Tips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.&nbsp;&lt;b&gt;Does Termly&#39;s legal terms generator cover all contract and consumer protection laws?&lt;&#x2F;b&gt;<br/>&nbsp;Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br/><br/>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.</div></div></div><div class="footer"><button type="button" class="bet-now" onclick="invokeNative()">Bet Now</button></div></body></html>',
            });
          });
        });

        describe('the fifth component', () => {
          beforeEach(() => {
            component = response.data[5];
          });

          it('has type "sports.match.tabs"', () => {
            component.type.should.eql('sports.match.tabs');
          });

          it('should not contain stats tab for match in play and stats enabled', () => {
            const index = component.data.findIndex((ele) => ele.tab === 'stats');
            index.should.eql(-1);
          });

          describe('has data', () => {
            it('with two tabs', () => {
              component.data.length.should.eql(2);
            });

            describe('the first tab', () => {
              beforeEach(() => {
                [tab] = component.data;
              });

              it('has title "All Markets"', () => {
                tab.title.should.eql('All Markets');
              });

              it('has tab "all"', () => {
                tab.tab.should.eql('all');
              });

              it('is active', () => {
                tab.active.should.eql(true);
              });

              it('has discovery key "bff:sports:match:markets"', () => {
                tab.discoveryKey.should.eql('bff:sports:match:markets');
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    tab.data[0].data.should.eql(allMarketsGSWvBos);
                  });
                });
              });
            });

            describe('the second tab', () => {
              beforeEach(() => {
                [, tab] = component.data;
              });

              it('has title "Same Game Multi"', () => {
                tab.title.should.eql('Same Game Multi');
              });

              it('has tab "sgm"', () => {
                tab.tab.should.eql('sgm');
              });

              it('is not active', () => {
                tab.active.should.eql(false);
              });

              it('has discovery key "bff:sports:match:same-game-multi"', () => {
                tab.discoveryKey.should.eql('bff:sports:match:same-game-multi');
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    tab.data[0].data.should.eql(sgmMarketsGSWvBos);
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('for a match with sky preview and vision', () => {
      describe('when called from playcentral', () => {
        const competitionName = 'NBA';
        const matchName = 'Golden State v Boston';

        beforeEach(async () => {
          requestCache.fetchInfo.withArgs('info:competiton:matches').resolves(wnbaMatches);
          requestCache.fetchInfo.withArgs('info:competiton:match').resolves(goldenVBoston);

          response = JSON.parse(
            JSON.stringify(
              await matchController.page(
                {
                  params: {
                    sportName: 'Basketball',
                    competitionName,
                    matchName,
                  },
                  query: {
                    jurisdiction: 'QLD',
                    referrer: 'playcentral',
                  },
                },
                res,
                next,
              ),
            ),
          );
        });

        it('has type "sports.sport.match"', () => {
          response.type.should.eql('sports.sport.match');
        });

        describe('the vision component', () => {
          beforeEach(() => {
            component = response.data[2];
          });

          it('has type "sports.match.media"', () => {
            component.type.should.eql('sports.match.media');
          });

          it('has playcentral style display', () => {
            component.collapsible.should.eql(false);
            component.isCollapsed.should.eql(false);
            component.autoPlay.should.eql(true);
            component.showWatchButton.should.eql(false);
            component.showPreviewButton.should.eql(false);
          });

          it('has vision and preview data', () => {
            component.data.length.should.eql(2);
            component.data[0].type.should.eql('sports.match.vision');
            component.data[1].type.should.eql('sports.match.preview');
          });

          it('has 1 valid visualisation object', () => {
            component.data[0].data.length.should.eql(1);
            component.data[0].data[0].mediaType.should.eql('visualisation');
            component.data[0].data[0].provider.should.eql('sportingSolutions');
            component.data[0].data[0].content.should.eql({
              id: 'da31daea-5441-41ce-8b41-f47a2335333f',
              sport: 'Basketball',
            });
          });

          it('has 1 valid preview object', () => {
            component.data[1].data.length.should.eql(1);
            component.data[1].data[0].mediaType.should.eql('vision');
            component.data[1].data[0].provider.should.eql('tab');
            component.data[1].data[0].content.requiresAuthentication.should.eql(true);
            component.data[1].data[0].content._links.providerStreamUrl.should.eql(
              'https://mediatabs.skyracing.com.au/VOD/Sports%20Previews/GSWvBos.mp4',
            );
          });
        });
      });

      describe('Vision toggles', () => {
        const competitionName = 'NBA';
        const matchName = 'Golden State v Boston';

        beforeEach(async () => {
          requestCache.fetchInfo.withArgs('info:competiton:matches').resolves(wnbaMatches);
          requestCache.fetchInfo.withArgs('info:competiton:match').resolves(goldenVBoston);
        });
        afterEach(() => {
          config.getDynamicConfig.returns({
            ...dynamicConfig,
          });
        });

        it('Does not have a preview component', async () => {
          config.getDynamicConfig.returns({
            ...dynamicConfig,
            toggles: {
              hideVisionPreview: true,
            },
          });

          response = JSON.parse(
            JSON.stringify(
              await matchController.page(
                {
                  params: {
                    sportName: 'Basketball',
                    competitionName,
                    matchName,
                  },
                  query: {
                    jurisdiction: 'QLD',
                    referrer: 'playcentral',
                  },
                },
                res,
                next,
              ),
            ),
          );
          component = response.data[2].data[1];
          component.type.should.not.eql('sports.match.preview');
        });
        it('Does not have a vision component', async () => {
          config.getDynamicConfig.returns({
            ...dynamicConfig,
            hideVisionProviders: ['sportingsolutions'],
          });

          response = JSON.parse(
            JSON.stringify(
              await matchController.page(
                {
                  params: {
                    sportName: 'Basketball',
                    competitionName,
                    matchName,
                  },
                  query: {
                    jurisdiction: 'QLD',
                    referrer: 'playcentral',
                  },
                },
                res,
                next,
              ),
            ),
          );
          component = response.data[2].data[0];
          component.type.should.not.eql('sports.match.vision');
        });
        it('Does not have preview or vision components', async () => {
          config.getDynamicConfig.returns({
            ...dynamicConfig,
            toggles: {
              hideVisionPreview: true,
            },
            hideVisionProviders: ['sportingsolutions'],
          });

          response = JSON.parse(
            JSON.stringify(
              await matchController.page(
                {
                  params: {
                    sportName: 'Basketball',
                    competitionName,
                    matchName,
                  },
                  query: {
                    jurisdiction: 'QLD',
                    referrer: 'playcentral',
                  },
                },
                res,
                next,
              ),
            ),
          );
          component = response.data[2];
          component.type.should.not.eql('sports.match.media');
        });
      });
    });

    describe('for a match with vision and preview tile', () => {
      describe('when called from playcentral', () => {
        const competitionName = 'NBA';
        const matchName = 'Golden State v Boston';

        beforeEach(async () => {
          requestCache.fetchInfo.withArgs('info:competiton:matches').resolves(wnbaMatches);
          requestCache.fetchInfo.withArgs('info:competiton:match').resolves(visionGoldenVBoston);
          requestCache.fetchContentHub.withArgs('content-hub:get:match:tile:hero:url').resolves([
            {
              background: {
                default:
                  'https://images.prismic.io/tabcms/802687b5-aa44-48d1-9150-8dd9a996edec_presheet-background-mbl%401x.png?auto=compress,format',
                hdpi: 'https://images.prismic.io/tabcms/e6cedd92-5a02-440b-a404-80af52e0ab42_carousel-background-mlb.png?auto=compress,format',
                xhdpi:
                  'https://images.prismic.io/tabcms/925dc7a5-bc51-4a15-a702-2fb1888d4142_presheet-background-mbl.png?auto=compress,format',
                xxhdpi:
                  'https://images.prismic.io/tabcms/e5565617-e530-44c6-857f-6c70b8c28cd9_presheet-background-mbl.png?auto=compress,format',
                xxxhdpi:
                  'https://images.prismic.io/tabcms/be4125c3-3d93-4034-a352-65af70659673_presheet-background-mbl.png?auto=compress,format',
                mdpi: 'https://images.prismic.io/tabcms/61d92a69-c79c-4c1b-9541-8aca0275a7e5_presheet-background-mbl.png?auto=compress,format',
                '2x': 'https://images.prismic.io/tabcms/304e8113-665d-432d-8800-763a2f9b6a72_presheet-background-mbl%402x.png?auto=compress,format',
                '3x': 'https://images.prismic.io/tabcms/fab5e0b3-8c2f-4fd0-b9a8-03c8933661fe_presheet-background-mbl%403x.png?auto=compress,format',
              },
              overlay: {
                left: {
                  '2x': 'https://metadata.beta.tab.com.au/icons/Altern-Icons/MLB/Large/losangeles-angels_2x.png',
                  '3x': 'https://metadata.beta.tab.com.au/icons/Altern-Icons/MLB/Large/losangeles-angels_3x.png',
                  xxhdpi:
                    'https://metadata.beta.tab.com.au/icons/Altern-Icons/MLB/Large/losangeles-angels_xxhdpi.webp',
                },
                right: {
                  '2x': 'https://metadata.beta.tab.com.au/icons/Altern-Icons/MLB/Large/toronto-blue-jays_2x.png',
                  '3x': 'https://metadata.beta.tab.com.au/icons/Altern-Icons/MLB/Large/toronto-blue-jays_3x.png',
                  xxhdpi:
                    'https://metadata.beta.tab.com.au/icons/Altern-Icons/MLB/Large/toronto-blue-jays_xxhdpi.webp',
                },
              },
              includeOdds: false,
            },
          ]);

          response = JSON.parse(
            JSON.stringify(
              await matchController.page(
                {
                  params: {
                    sportName: 'Basketball',
                    competitionName,
                    matchName,
                  },
                  query: {
                    jurisdiction: 'QLD',
                    referrer: 'playcentral',
                  },
                },
                res,
                next,
              ),
            ),
          );
        });

        it('has type "sports.sport.match"', () => {
          response.type.should.eql('sports.sport.match');
        });

        describe('the vision component', () => {
          beforeEach(() => {
            component = response.data[2];
          });

          it('has type "sports.match.media"', () => {
            component.type.should.eql('sports.match.media');
          });

          it('has playcentral style display', () => {
            component.collapsible.should.eql(false);
            component.isCollapsed.should.eql(false);
            component.autoPlay.should.eql(true);
            component.showWatchButton.should.eql(false);
            component.showPreviewButton.should.eql(false);
          });

          it('has vision and preview tile data', () => {
            component.data.length.should.eql(2);
            component.data[0].type.should.eql('sports.match.vision');
            component.data[1].type.should.eql('sports.match.tile');
          });

          it('has 1 valid visualisation object', () => {
            component.data[0].data.length.should.eql(1);
            component.data[0].data[0].mediaType.should.eql('visualisation');
            component.data[0].data[0].provider.should.eql('sportingSolutions');
            component.data[0].data[0].content.should.eql({
              id: 'da31daea-5441-41ce-8b41-f47a2335333f',
              sport: 'Basketball',
            });
          });

          it('has 1 valid tile object', () => {
            component.data[1].data.length.should.eql(1);
            component.data[1].data[0].background.should.eql({
              default:
                'https://images.prismic.io/tabcms/802687b5-aa44-48d1-9150-8dd9a996edec_presheet-background-mbl%401x.png?auto=compress,format',
              hdpi: 'https://images.prismic.io/tabcms/e6cedd92-5a02-440b-a404-80af52e0ab42_carousel-background-mlb.png?auto=compress,format',
              xhdpi:
                'https://images.prismic.io/tabcms/925dc7a5-bc51-4a15-a702-2fb1888d4142_presheet-background-mbl.png?auto=compress,format',
              xxhdpi:
                'https://images.prismic.io/tabcms/e5565617-e530-44c6-857f-6c70b8c28cd9_presheet-background-mbl.png?auto=compress,format',
              xxxhdpi:
                'https://images.prismic.io/tabcms/be4125c3-3d93-4034-a352-65af70659673_presheet-background-mbl.png?auto=compress,format',
              mdpi: 'https://images.prismic.io/tabcms/61d92a69-c79c-4c1b-9541-8aca0275a7e5_presheet-background-mbl.png?auto=compress,format',
              '2x': 'https://images.prismic.io/tabcms/304e8113-665d-432d-8800-763a2f9b6a72_presheet-background-mbl%402x.png?auto=compress,format',
              '3x': 'https://images.prismic.io/tabcms/fab5e0b3-8c2f-4fd0-b9a8-03c8933661fe_presheet-background-mbl%403x.png?auto=compress,format',
            });
            response.data[2].data[1].data[0].overlay.should.eql({
              left: {
                '2x': 'https://metadata.beta.tab.com.au/icons/Altern-Icons/MLB/Large/losangeles-angels_2x.png',
                '3x': 'https://metadata.beta.tab.com.au/icons/Altern-Icons/MLB/Large/losangeles-angels_3x.png',
                xxhdpi:
                  'https://metadata.beta.tab.com.au/icons/Altern-Icons/MLB/Large/losangeles-angels_xxhdpi.webp',
              },
              right: {
                '2x': 'https://metadata.beta.tab.com.au/icons/Altern-Icons/MLB/Large/toronto-blue-jays_2x.png',
                '3x': 'https://metadata.beta.tab.com.au/icons/Altern-Icons/MLB/Large/toronto-blue-jays_3x.png',
                xxhdpi:
                  'https://metadata.beta.tab.com.au/icons/Altern-Icons/MLB/Large/toronto-blue-jays_xxhdpi.webp',
              },
            });
            response.data[2].data[1].data[0].includeOdds.should.eql(false);
          });
        });

        describe('the match carousel component', () => {
          beforeEach(() => {
            component = response.data[3];
          });

          it('exists', () => {
            component.type.should.eql('sports.match.carousel');
          });

          it('has the correct data', () => {
            component.matches.should.eql([
              {
                title: 'Los Angeles v Washington',
                startTime: '2022-07-13T02:30:00.000Z',
                imageURL: 'some.url/nba1.png',
                navigation: {
                  template: 'screen:sport:match',
                  discoveryKey: 'bff:sports:match:page',
                  params: {
                    sportName: 'Basketball',
                    competitionName: 'NBA',
                    matchName: 'Los Angeles v Washington',
                  },
                },
              },
              {
                title: 'Indiana v Connecticut',
                startTime: '2022-07-13T16:00:00.000Z',
                imageURL: 'some.url/nba2.png',
                navigation: {
                  template: 'screen:sport:match',
                  discoveryKey: 'bff:sports:match:page',
                  params: {
                    sportName: 'Basketball',
                    competitionName: 'NBA',
                    matchName: 'Indiana v Connecticut',
                  },
                },
              },
            ]);
          });
        });
      });
    });

    describe('for a match with sky preview only', () => {
      describe('when called from playcentral', () => {
        const competitionName = 'NBA';
        const matchName = 'Golden State v Boston';

        beforeEach(async () => {
          requestCache.fetchInfo.withArgs('info:competiton:matches').resolves(wnbaMatches);
          requestCache.fetchInfo.withArgs('info:competiton:match').resolves(previewGoldenVBoston);

          response = JSON.parse(
            JSON.stringify(
              await matchController.page(
                {
                  params: {
                    sportName: 'Basketball',
                    competitionName,
                    matchName,
                  },
                  query: {
                    jurisdiction: 'QLD',
                    referrer: 'playcentral',
                  },
                },
                res,
                next,
              ),
            ),
          );
        });

        it('has type "sports.sport.match"', () => {
          response.type.should.eql('sports.sport.match');
        });

        describe('the vision component', () => {
          beforeEach(() => {
            component = response.data[2];
          });

          it('has type "sports.match.media"', () => {
            component.type.should.eql('sports.match.media');
          });

          it('has sports style display', () => {
            component.collapsible.should.eql(false);
            component.isCollapsed.should.eql(false);
            component.autoPlay.should.eql(true);
            component.showWatchButton.should.eql(false);
            component.showPreviewButton.should.eql(false);
          });

          it('has preview data only', () => {
            component.data.length.should.eql(1);
            component.data[0].type.should.eql('sports.match.preview');
          });

          it('has 1 valid preview object', () => {
            component.data[0].data.length.should.eql(1);
            component.data[0].data[0].mediaType.should.eql('vision');
            component.data[0].data[0].provider.should.eql('tab');
            component.data[0].data[0].content.requiresAuthentication.should.eql(true);
            component.data[0].data[0].content._links.providerStreamUrl.should.eql(
              'https://mediatabs.skyracing.com.au/VOD/Sports%20Previews/GSWvBos.mp4',
            );
          });
        });
      });
    });

    describe('when info-wift throws an error', () => {
      beforeEach(async () => {
        sinon.stub(log, 'error').callsFake(() => { });

        requestCache.fetchInfo.throws();

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
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
          ),
        );
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

    describe('when trending SGM enabled and trending SGM returning valid data', () => {
      const competitionName = 'Japan J1 League';
      const matchName = 'Shimizu v FC Tokyo';

      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:competiton:matches').resolves(japanJ1LeagueMatches);
        requestCache.fetchInfo.withArgs('info:competiton:match').resolves(shimizuVFcTokyo);
        launchDarklyTrendingSGMBetsEnabledStub.returns(true);
        launchDarklyTrendingSGMGropuDisplayIndexStub.returns(1);
        request.get.withArgs(trendingBetsService.url).resolves([
          {
            propositions: [237338, 237489],
            numPunters: 4,
            odds: 6.5,
          },
          {
            propositions: [237354, 237481],
            numPunters: 3,
            odds: 201.0,
          },
        ]);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Soccer',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'QLD',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('has type "sports.sport.match"', () => {
        response.type.should.eql('sports.sport.match');
      });

      describe('has data', () => {
        it('with five components', () => {
          response.data.length.should.eql(5);
        });

        describe('the first component', () => {
          beforeEach(() => {
            [component] = response.data;
          });

          it('has type "sports.match.list"', () => {
            component.type.should.eql('sports.match.list');
          });

          it('has title [Match Name]', () => {
            component.title.should.eql(matchName);
          });

          it('has correct data', () => {
            component.data.should.eql(matchListShimizuVFCTokyo);
          });
        });

        describe('the second component', () => {
          beforeEach(() => {
            [, component] = response.data;
          });

          it('has type "sports.match.header"', () => {
            component.type.should.eql('sports.match.header');
          });

          it('has title [Competition Name]', () => {
            component.title.should.eql(competitionName);
          });

          it('has correct display time', () => {
            component.displayTime.should.eql(shimizuVFcTokyo.markets[0].closeTime);
          });

          it('has correct start time', () => {
            component.startTime.should.eql(shimizuVFcTokyo.startTime);
          });

          it('has correct in-play flag', () => {
            component.inPlay.should.eql(shimizuVFcTokyo.inPlay);
          });

          it('has correct icon', () => {
            component.icon.appIconIdentifier.should.eql('soccer');
          });
        });

        describe('the third component', () => {
          beforeEach(() => {
            component = response.data[2];
          });

          it('has type "sports.match.media"', () => {
            component.type.should.eql('sports.match.media');
          });

          it('has sports style display', () => {
            component.collapsible.should.eql(true);
            component.isCollapsed.should.eql(true);
            component.autoPlay.should.eql(false);
            component.showWatchButton.should.eql(true);
            component.showPreviewButton.should.eql(false);
          });

          it('has vision only data', () => {
            component.data.length.should.eql(1);
            component.data[0].type.should.eql('sports.match.vision');
          });

          it('has 1 valid visualisation object', () => {
            component.data[0].data.length.should.eql(1);
            component.data[0].data[0].mediaType.should.eql('visualisation');
            component.data[0].data[0].provider.should.eql('performVisualisation');
            component.data[0].data[0].content.should.eql({
              _links: {
                self: 'https://api.beta.tab.com.au/v1/vision-service/tab-act/matches/ShmzvFCTk/performVisualisation',
              },
              eventId: 'by574nwoq3d1wg7eq5s1gjris',
              requiresAuthentication: false,
              startTime: '2022-05-25T10:00:00Z',
            });
          });
        });

        describe('the fourth component', () => {
          beforeEach(() => {
            component = response.data[3];
          });

          it('has type "sports.match.media.buttons"', () => {
            component.type.should.eql('sports.match.media.buttons');
          });

          it('has sports style display', () => {
            component.buttons.showWatchButton.should.eql(true);
            component.buttons.showPreviewButton.should.eql(false);
          });
        });

        describe('the fifth component', () => {
          beforeEach(() => {
            component = response.data[4];
          });

          it('has type "sports.match.tabs"', () => {
            component.type.should.eql('sports.match.tabs');
          });

          describe('has data', () => {
            it('with two tabs', () => {
              component.data.length.should.eql(2);
            });

            describe('the first tab', () => {
              beforeEach(() => {
                [tab] = component.data;
                request.get.withArgs(trendingBetsService.url).resolves([
                  {
                    propositions: [237338, 237489],
                    numPunters: 4,
                    odds: 6.50,
                  },
                  {
                    propositions: [237354, 237481],
                    numPunters: 3,
                    odds: 201.00,
                  },
                ]);
              });

              it('has title "All Markets"', () => {
                tab.title.should.eql('All Markets');
              });

              it('has tab "all"', () => {
                tab.tab.should.eql('all');
              });

              it('is active', () => {
                tab.active.should.eql(true);
              });

              it('has discovery key "bff:sports:match:markets"', () => {
                tab.discoveryKey.should.eql('bff:sports:match:markets');
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    const allMarketsDataShimizuVFCTokyo = JSON.parse(
                      JSON.stringify(allMarketsShimizuVFCTokyo),
                    );
                    allMarketsDataShimizuVFCTokyo.splice(1, 0, shimizuVFCTokyoTrendingBets);
                    tab.data[0].data.should.eql(allMarketsDataShimizuVFCTokyo);
                  });
                });
              });
            });

            describe('the second tab', () => {
              beforeEach(() => {
                [, tab] = component.data;
              });

              it('has title "Same Game Multi"', () => {
                tab.title.should.eql('Same Game Multi');
              });

              it('has tab "sgm"', () => {
                tab.tab.should.eql('sgm');
              });

              it('is not active', () => {
                tab.active.should.eql(false);
              });

              it('has discovery key "bff:sports:match:same-game-multi"', () => {
                tab.discoveryKey.should.eql('bff:sports:match:same-game-multi');
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    const sgmMarketsDataShimizuVFCTokyo = JSON.parse(
                      JSON.stringify(sgmMarketsShimizuVFCTokyo),
                    );
                    sgmMarketsDataShimizuVFCTokyo.splice(1, 0, shimizuVFCTokyoTrendingBets);
                    tab.data[0].data.should.eql(sgmMarketsDataShimizuVFCTokyo);
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('when trending SGM not enabled and trending SGM returning valid data', () => {
      const competitionName = 'Japan J1 League';
      const matchName = 'Shimizu v FC Tokyo';

      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:competiton:matches').resolves(japanJ1LeagueMatches);
        requestCache.fetchInfo.withArgs('info:competiton:match').resolves(shimizuVFcTokyo);
        launchDarklyTrendingSGMBetsEnabledStub.returns(false);
        request.get.withArgs(trendingBetsService.url).resolves([
          {
            propositions: [237338, 237489],
            numPunters: 4,
            odds: 6.50,
          },
          {
            propositions: [237354, 237481],
            numPunters: 3,
            odds: 201.00,
          },
        ]);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Soccer',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'QLD',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('has type "sports.sport.match"', () => {
        response.type.should.eql('sports.sport.match');
      });

      describe('has data', () => {
        describe('the fifth component', () => {
          beforeEach(() => {
            component = response.data[4];
          });

          it('has type "sports.match.tabs"', () => {
            component.type.should.eql('sports.match.tabs');
          });

          describe('has data', () => {
            it('with two tabs', () => {
              component.data.length.should.eql(2);
            });

            describe('the first tab', () => {
              beforeEach(() => {
                [tab] = component.data;
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    tab.data[0].data.should.eql(allMarketsShimizuVFCTokyo);
                  });
                });
              });
            });

            describe('the second tab', () => {
              beforeEach(() => {
                [, tab] = component.data;
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    tab.data[0].data.should.eql(sgmMarketsShimizuVFCTokyo);
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('when trending SGM enabled, propIds is missing in info service and trending SGM returning valid data', () => {
      const competitionName = 'Japan J1 League';
      const matchName = 'Shimizu v FC Tokyo';

      beforeEach(async () => {
        requestCache.fetchInfo.withArgs('info:competiton:matches').resolves(japanJ1LeagueMatches);
        requestCache.fetchInfo.withArgs('info:competiton:match').resolves(shimizuVFcTokyo);
        launchDarklyTrendingSGMBetsEnabledStub.returns(true);
        launchDarklyTrendingSGMGropuDisplayIndexStub.returns(1);
        request.get.withArgs(trendingBetsService.url).resolves([
          {
            propositions: [237338, 237489],
            numPunters: 4,
            odds: 6.5,
          },
          {
            propositions: [237354, 237481, 237482],
            numPunters: 3,
            odds: 201.0,
          },
        ]);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Soccer',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'QLD',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('has type "sports.sport.match"', () => {
        response.type.should.eql('sports.sport.match');
      });

      describe('has data', () => {
        describe('the fifth component', () => {
          beforeEach(() => {
            component = response.data[4];
          });

          describe('has data', () => {
            describe('the first tab', () => {
              beforeEach(() => {
                [tab] = component.data;
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    const allMarketsDataShimizuVFCTokyo = JSON.parse(
                      JSON.stringify(allMarketsShimizuVFCTokyo),
                    );
                    allMarketsDataShimizuVFCTokyo
                      .splice(1, 0, shimizuVFCTokyoTrendingBetsMissingPropIds);
                    tab.data[0].data.should.eql(allMarketsDataShimizuVFCTokyo);
                  });
                });
              });
            });

            describe('the second tab', () => {
              beforeEach(() => {
                [, tab] = component.data;
              });

              describe('has data', () => {
                it('with one component', () => {
                  tab.data.length.should.eql(1);
                });

                describe('the component', () => {
                  it('has type "sports.match.markets"', () => {
                    tab.data[0].type.should.eql('sports.match.markets');
                  });

                  it('has the correct data', () => {
                    const sgmMarketsDataShimizuVFCTokyo = JSON.parse(
                      JSON.stringify(sgmMarketsShimizuVFCTokyo),
                    );
                    sgmMarketsDataShimizuVFCTokyo
                      .splice(1, 0, shimizuVFCTokyoTrendingBetsMissingPropIds);
                    tab.data[0].data.should.eql(sgmMarketsDataShimizuVFCTokyo);
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('for a match without same game multi markets, should not call trending service when trending SGM enabled', () => {
      const competitionName = 'Australian Federal Politics';
      const matchName = 'Next Federal Election';

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches')
          .resolves(australianFederalPoliticsMatches);
        requestCache.fetchInfo.withArgs('info:competiton:match').resolves(nextFederalElection);
        launchDarklyTrendingSGMBetsEnabledStub.returns(true);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Politics',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'NSW',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('has type "sports.sport.match"', () => {
        response.type.should.eql('sports.sport.match');
      });

      it('should not call trending service', () => {
        sinon.assert.notCalled(request.get.withArgs(trendingBetsService.url));
      });

      describe('has data', () => {
        it('with three components', () => {
          response.data.length.should.eql(3);
        });
      });
    });

    describe('for a In play game, should not call trending service when trending SGM enabled', () => {
      const competitionName = 'EuroLeague';
      const matchName = 'Partizan v ASVEL Lyon';

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches').resolves(euroLeagueMatches)
          .withArgs('info:competiton:match').resolves(partizanvlyanInPlay);

        launchDarklyTrendingSGMBetsEnabledStub.returns(true);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Soccer',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'NSW',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('has type "sports.sport.match"', () => {
        response.type.should.eql('sports.sport.match');
      });

      it('should not call trending service', () => {
        sinon.assert.notCalled(request.get.withArgs(trendingBetsService.url));
      });

      describe('has data', () => {
        it('with three components', () => {
          response.data.length.should.eql(3);
        });
      });
    });

    describe('for a match with stats for version 12.3.0', () => {
      const competitionName = 'NBA';
      const matchName = 'Detroit v Dallas';

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches').resolves(nbaMatches)
          .withArgs('info:competiton:match').resolves(detVDalMatch);

        requestCache.fetchStats
          .withArgs('stats-service:get:stats:matchup').resolves(detVDalMatchupSuccess)
          .withArgs('stats-service:get:stats:standings').resolves(detVDalStandingsSuccessSame);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Basketball',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'NSW',
                  version: '12.3.0',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      describe('market component', () => {
        beforeEach(() => {
          component = response.data[4];
          [tab] = component.data;
          [market] = tab.data[0].data;
        });

        it('Line market contains stats object', () => {
          const marketData = market.data[1].data[0];
          marketData.should.eql(detVDalLineMarketOld);
        });

        it('Result market contains stats object', () => {
          const marketData = market.data[0].data[0];
          marketData.should.eql(detVDalResultMarketSame);
        });
      });
    });

    describe('for a match with stats for version 12.3.1 for same conf', () => {
      const competitionName = 'NBA';
      const matchName = 'Detroit v Dallas';

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches').resolves(nbaMatches)
          .withArgs('info:competiton:match').resolves(detVDalMatch);

        requestCache.fetchStats
          .withArgs('stats-service:get:stats:matchup').resolves(detVDalMatchupSuccess)
          .withArgs('stats-service:get:stats:standings').resolves(detVDalStandingsSuccessSame);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Basketball',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'NSW',
                  version: '12.3.1',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      describe('market component', () => {
        beforeEach(() => {
          component = response.data[4];
          [tab] = component.data;
          [market] = tab.data[0].data;
        });

        it('Line market contains stats object', () => {
          const marketData = market.data[1].data[0];
          marketData.should.eql(detVDalLineMarketNew);
        });

        it('Result market contains stats object', () => {
          const marketData = market.data[0].data[0];
          marketData.should.eql(detVDalResultMarketSame);
        });
      });
    });

    describe('for a match with stats for version 12.3.1 for same conf with integrated stats disabled', () => {
      const competitionName = 'NBA';
      const matchName = 'Detroit v Dallas';

      beforeEach(async () => {
        config.getDynamicConfig.returns({
          ...dynamicConfig,
          toggles: {
            hideIntegratedStats: ['NBA'],
          },
        });
      });

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches').resolves(nbaMatches)
          .withArgs('info:competiton:match').resolves(detVDalMatch);

        requestCache.fetchStats
          .withArgs('stats-service:get:stats:matchup').resolves(detVDalMatchupSuccess)
          .withArgs('stats-service:get:stats:standings').resolves(detVDalStandingsSuccessSame);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Basketball',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'NSW',
                  version: '12.3.1',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      describe('market component', () => {
        beforeEach(() => {
          component = response.data[4];
          [tab] = component.data;
          [market] = tab.data[0].data;
        });

        it('Line market does not contains stats object', () => {
          const marketData = market.data[1].data[0];
          should.not.exist(marketData.stats);
        });

        it('Result market does not contains stats object', () => {
          const marketData = market.data[0].data[0];
          should.not.exist(marketData.stats);
        });
      });
    });

    describe('for a match with stats for version 12.3.1 for diff conference', () => {
      const competitionName = 'NBA';
      const matchName = 'Detroit v Dallas';

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches').resolves(nbaMatches)
          .withArgs('info:competiton:match').resolves(detVDalMatch);

        requestCache.fetchStats
          .withArgs('stats-service:get:stats:matchup').resolves(detVDalMatchupSuccess)
          .withArgs('stats-service:get:stats:standings').resolves(detVDalStandingsSuccessDiff);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Basketball',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'NSW',
                  version: '12.3.1',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      describe('market component', () => {
        beforeEach(() => {
          component = response.data[4];
          [tab] = component.data;
          [market] = tab.data[0].data;
        });

        it('Result market contains stats object', () => {
          const marketData = market.data[0].data[0];
          marketData.should.eql(detVDalResultMarketDiff);
        });
      });
    });

    describe('for a match with stats for version 12.6.0', () => {
      const competitionName = 'NBA';
      const matchName = 'Detroit v Dallas';

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches').resolves(nbaMatches)
          .withArgs('info:competiton:match').resolves(detVDalMatch);

        requestCache.fetchStats
          .withArgs('stats-service:bff:matchup').resolves(matchup)
          .withArgs('stats-service:bff:ranking').resolves(table);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Basketball',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'QLD',
                  version: '12.6.0',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('there is a stats toggle component with a "new" tag', () => {
        response.data[4].should.eql({
          type: 'sports.match.stats.toggle',
          isDefaultEnabled: true,
          showNewTag: true,
          showPlayerOnboarding: false,
        });
      });

      describe('market component', () => {
        beforeEach(() => {
          component = response.data[5];
          [tab] = component.data;
          [market] = tab.data[0].data;
        });

        it('Line market has stats object', () => {
          const marketData = market.data[1].data[0];
          marketData.should.eql(detVDalLine);
        });

        it('Head To Head market has stats object', () => {
          const marketData = market.data[0].data[0];
          marketData.should.eql(detVDalH2H);
        });
      });
    });

    describe('for a match with stats for version 12.9.0', () => {
      const competitionName = 'NBA';
      const matchName = 'Detroit v Dallas';

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches').resolves(nbaMatches)
          .withArgs('info:competiton:match').resolves(detVDalMatch);

        requestCache.fetchStats
          .withArgs('stats-service:bff:matchup').resolves(matchup)
          .withArgs('stats-service:bff:table').resolves(table);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Basketball',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'QLD',
                  version: '12.9.0',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('there is a stats toggle component without a "new" tag', () => {
        response.data[4].should.eql({
          type: 'sports.match.stats.toggle',
          isDefaultEnabled: true,
          showNewTag: false,
          showPlayerOnboarding: false,
        });
      });
    });

    describe('for a match with stats for version 12.7.0 and stats centre toggled off', () => {
      const competitionName = 'NBA';
      const matchName = 'Detroit v Dallas';

      beforeEach(async () => {
        config.getDynamicConfig.returns({
          ...dynamicConfig,
          toggles: {
            hideStatsCentre: ['NBA'],
          },
        });
      });

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches').resolves(nbaMatches)
          .withArgs('info:competiton:match').resolves(detVDalMatch);

        requestCache.fetchStats
          .withArgs('stats-service:bff:matchup').resolves(matchup)
          .withArgs('stats-service:bff:table').resolves(table);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Basketball',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'QLD',
                  version: '12.7.0',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      it('there is no stats tab', () => {
        response.data[5].type.should.eql('sports.match.tabs');
        response.data[5].data.length.should.eql(1);
        response.data[5].data[0].title.should.eql('All Markets');
      });
    });

    describe('for a match with stats for version 12.3.0 but stats-service throws an error', () => {
      const competitionName = 'NBA';
      const matchName = 'Detroit v Dallas';

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches').resolves(nbaMatches)
          .withArgs('info:competiton:match').resolves(detVDalMatch);

        requestCache.fetchStats
          .withArgs('stats-service:get:stats:matchup').resolves(statsError)
          .withArgs('stats-service:get:stats:standings').resolves(statsError);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Basketball',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'NSW',
                  version: '12.3.0',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      describe('market component', () => {
        beforeEach(() => {
          component = response.data[4];
          [tab] = component.data;
          [market] = tab.data[0].data;
        });

        it('Line market do not contain stats object', () => {
          const statsExist = Object.keys(market.data[1].data[0]).includes('stats');
          statsExist.should.eql(false);
        });

        it('Result market do not contain stats object', () => {
          const statsExist = Object.keys(market.data[0].data[0]).includes('stats');
          statsExist.should.eql(false);
        });
      });
    });

    describe('for a match with stats for version 12.3.1 but stats-service throws an error', () => {
      const competitionName = 'NBA';
      const matchName = 'Detroit v Dallas';

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches').resolves(nbaMatches)
          .withArgs('info:competiton:match').resolves(detVDalMatch);

        requestCache.fetchStats
          .withArgs('stats-service:get:stats:matchup').resolves(statsError)
          .withArgs('stats-service:get:stats:standings').resolves(statsError);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Basketball',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'NSW',
                  version: '12.3.1',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      describe('market component', () => {
        beforeEach(() => {
          component = response.data[4];
          [tab] = component.data;
          [market] = tab.data[0].data;
        });

        it('Line market do not contain stats object', () => {
          const statsExist = Object.keys(market.data[1].data[0]).includes('stats');
          statsExist.should.eql(false);
        });

        it('Result market do not contain stats object', () => {
          const statsExist = Object.keys(market.data[0].data[0]).includes('stats');
          statsExist.should.eql(false);
        });
      });
    });

    describe('for a match with stats for version 12.6.0 but stats-service throws an error', () => {
      const competitionName = 'NBA';
      const matchName = 'Detroit v Dallas';

      beforeEach(async () => {
        requestCache.fetchInfo
          .withArgs('info:competiton:matches').resolves(nbaMatches)
          .withArgs('info:competiton:match').resolves(detVDalMatch);

        requestCache.fetchStats
          .withArgs('stats-service:bff:matchup').resolves(statsError)
          .withArgs('stats-service:bff:table').resolves(statsError);

        response = JSON.parse(
          JSON.stringify(
            await matchController.page(
              {
                params: {
                  sportName: 'Basketball',
                  competitionName,
                  matchName,
                },
                query: {
                  jurisdiction: 'QLD',
                  version: '12.6.0',
                },
              },
              res,
              next,
            ),
          ),
        );
      });

      describe('market component', () => {
        beforeEach(() => {
          component = response.data[5];
          [tab] = component.data;
          [market] = tab.data[0].data;
        });

        it('Line market do not contain stats object', () => {
          const statsExist = Object.keys(market.data[1].data[0]).includes('stats');
          statsExist.should.eql(false);
        });

        it('Result market do not contain stats object', () => {
          const statsExist = Object.keys(market.data[0].data[0]).includes('stats');
          statsExist.should.eql(false);
        });
      });
    });
  });
});
