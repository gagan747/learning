const sinon = require('sinon');

const promoVisibility = require('../mocks/aem/sport.promo.visbility.json');
const wtaDohaResults = require('../mocks/info-wift/results/wta-doha.json');
const golf = require('../mocks/info-wift/sports/golf.json');
const tennis = require('../mocks/info-wift/sports/tennis.json');
const itfwNaples = require('../mocks/info-wift/tournaments/itfw-naples.json');
const mexicoOpen = require('../mocks/info-wift/tournaments/mexico-open.json');

const tournamentController = require(`${global.SRC}/controllers/tournament`);
const log = require(`${global.SRC}/log`);
const requestCache = require(`${global.SRC}/request-cache`);

describe('Tournament controller', () => {
  const res = {
    json: (args) => args,
    status: (args) => args,
  };

  const next = () => { };

  let response;

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    sinon.stub(requestCache, 'fetchInfo');
    sinon.stub(requestCache, 'fetchAem');
  });

  describe('Results response', () => {
    beforeEach(async () => {
      requestCache.fetchInfo.withArgs('info:tournament:matches:results').resolves(wtaDohaResults);
      requestCache.fetchAem.withArgs('promo').resolves(promoVisibility);

      response = JSON.parse(JSON.stringify(
        await tournamentController.results(
          {
            params: {
              sportName: 'Tennis',
              competitionName: 'WTA',
              tournamentName: 'WTA Doha',
            },
            query: {
              jurisdiction: 'QLD',
              platform: 'mobile',
              os: 'ios',
              version: '1.0.0',
            },
          },
          res,
          next,
        ),
      ));
    });

    it('has type "sports.competition.results"', () => {
      response.type.should.eql('sports.competition.results');
    });

    it('has title "[Tournament Name] Results"', () => {
      response.title.should.eql('WTA Doha Results');
    });

    it('has discovery key "bff:sports:tournament:results"', () => {
      response.discoveryKey.should.eql('bff:sports:tournament:results');
    });

    describe('has data', () => {
      it('with (4) items', () => {
        response.data.length.should.eql(4);
      });

      it('with the correct matches', () => {
        response.data.should.eql([
          {
            name: 'Teichmann v Kerber',
            displayName: 'Teichmann v Kerber',
            spectrumId: 'TchmvKerb',
            navigation: {
              template: 'match:results',
              discoveryKey: 'bff:sports:tournament-match:results',
              params: {
                sportName: 'Tennis',
                competitionName: 'WTA',
                tournamentName: 'WTA Doha',
                matchName: 'Teichmann v Kerber',
              },
            },
          },
          {
            name: 'Rybakina v Cristian',
            displayName: 'Rybakina v Cristian',
            spectrumId: 'RbknvCstn',
            navigation: {
              template: 'match:results',
              discoveryKey: 'bff:sports:tournament-match:results',
              params: {
                sportName: 'Tennis',
                competitionName: 'WTA',
                tournamentName: 'WTA Doha',
                matchName: 'Rybakina v Cristian',
              },
            },
          },
          {
            name: 'Konjuh v Kontaveit',
            displayName: 'Konjuh v Kontaveit',
            spectrumId: 'KnjuvKtvt',
            navigation: {
              template: 'match:results',
              discoveryKey: 'bff:sports:tournament-match:results',
              params: {
                sportName: 'Tennis',
                competitionName: 'WTA',
                tournamentName: 'WTA Doha',
                matchName: 'Konjuh v Kontaveit',
              },
            },
          },
          {
            name: 'Rus v Kudermetova',
            displayName: 'Rus v Kudermetova',
            spectrumId: 'RusvKude',
            navigation: {
              template: 'match:results',
              discoveryKey: 'bff:sports:tournament-match:results',
              params: {
                sportName: 'Tennis',
                competitionName: 'WTA',
                tournamentName: 'WTA Doha',
                matchName: 'Rus v Kudermetova',
              },
            },
          },
        ]);
      });
    });
  });

  describe('Page response', () => {
    describe('when info-wift works', () => {
      describe('for ITFW Naples with Head To Head bet type', () => {
        beforeEach(async () => {
          sinon.useFakeTimers(Date.parse('2022-03-10T05:00:00.000Z'));

          requestCache.fetchInfo.withArgs('info:sports:sport').resolves(tennis);
          requestCache.fetchInfo.withArgs('info:competiton:tournament').resolves(itfwNaples);

          response = JSON.parse(JSON.stringify(
            await tournamentController.page(
              {
                params: {
                  sportName: 'Tennis',
                  competitionName: 'ITF Womens',
                  tournamentName: 'ITFW Naples',
                },
                query: {
                  jurisdiction: 'QLD',
                  platform: 'mobile',
                  os: 'ios',
                  version: '12.3.0',
                  activeChip: 'Head To Head',
                },
              },
              res,
              next,
            ),
          ));
        });

        it('has type "sports.sport.competition"', () => {
          response.type.should.eql('sports.sport.competition');
        });

        it('has sport name "Tennis"', () => {
          response.sportName.should.eql('Tennis');
        });

        it('has title "ITFW Naples"', () => {
          response.title.should.eql('ITFW Naples');
        });

        describe('has data', () => {
          it('with two items', () => {
            response.data.length.should.eql(2);
          });

          describe('first item', () => {
            it('has type "sports.competition.list"', () => {
              response.data[0].type.should.eql('sports.competition.list');
            });

            it('has title "Tennis"', () => {
              response.data[0].title.should.eql('Tennis');
            });

            it('has discovery key "bff:sports:sport"', () => {
              response.data[0].discoveryKey.should.eql('bff:sports:sport');
            });

            it('has refresh rate 30', () => {
              response.data[0].refreshRate.should.eql(30);
            });

            it('has correct data', () => {
              response.data[0].data.should.eql([
                {
                  name: 'ITFM Antalya',
                  displayName: 'ITFM Antalya',
                  competitionName: 'ITF Mens',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'ITFM Creteil',
                  displayName: 'ITFM Creteil',
                  competitionName: 'ITF Mens',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'ITFM Bhopal',
                  displayName: 'ITFM Bhopal',
                  competitionName: 'ITF Mens',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'ITFM Sharm El Sheikh',
                  displayName: 'ITFM Sharm El Sheikh',
                  competitionName: 'ITF Mens',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'ITFM Monastir',
                  displayName: 'ITFM Monastir',
                  competitionName: 'ITF Mens',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'ITFM Portimao',
                  displayName: 'ITFM Portimao',
                  competitionName: 'ITF Mens',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'ITFW Sharm El Sheikh',
                  displayName: 'ITFW Sharm El Sheikh',
                  competitionName: 'ITF Womens',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'ITFW Antalya',
                  displayName: 'ITFW Antalya',
                  competitionName: 'ITF Womens',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'ITFW Monastir',
                  displayName: 'ITFW Monastir',
                  competitionName: 'ITF Womens',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'ITFW Amiens',
                  displayName: 'ITFW Amiens',
                  competitionName: 'ITF Womens',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'ITFW Naples',
                  displayName: 'ITFW Naples',
                  competitionName: 'ITF Womens',
                  active: true,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'Australian Open Mens Futures',
                  displayName: 'Australian Open Mens Futures',
                  competitionName: 'Australian Open',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'Australian Open Womens Futures',
                  displayName: 'Australian Open Womens Futures',
                  competitionName: 'Australian Open',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
              ]);
            });
          });

          describe('second item', () => {
            it('has type "sports.competition.betOptions"', () => {
              response.data[1].type.should.eql('sports.competition.betOptions');
            });

            it('has filters', () => {
              response.data[1].filters.length.should.eql(1);
            });

            it('has filter object with all properties', () => {
              response.data[1].filters[0].should.eql({
                title: 'H2H',
                name: 'Head To Head',
                discoveryKey: 'bff:sports:tournament',
                active: true,
              });
            });

            describe('has data', () => {
              it('with one items', () => {
                response.data[1].data.length.should.eql(1);
              });

              describe('first item', () => {
                it('has type app.sports.timeGroups', () => {
                  response.data[1].data[0].type.should.eql('app.sports.timeGroups');
                });

                it('has groups with thisYear & nextYear if version is > 12.4.1', async () => {
                  response = JSON.parse(JSON.stringify(
                    await tournamentController.page(
                      {
                        params: {
                          sportName: 'Tennis',
                          competitionName: 'ITF Womens',
                          tournamentName: 'ITFW Naples',
                        },
                        query: {
                          jurisdiction: 'QLD',
                          platform: 'mobile',
                          os: 'ios',
                          version: '12.4.2',
                          activeChip: 'Head To Head',
                        },
                      },
                      res,
                      next,
                    ),
                  ));
                  response.data[1].data[0].groups.should.eql({
                    today: 'Today',
                    tomorrow: 'Tomorrow',
                    thisYear: 'EEEE dd MMM',
                    nextYear: 'EEEE dd MMM yyyy',
                  });
                });

                it('has groups ["Today", "Tomorrow", "dd/mm/yyyy"]', () => {
                  response.data[1].data[0].groups.should.eql(['Today', 'Tomorrow', 'dd/mm/yyyy']);
                });

                it('has correct data', () => {
                  response.data[1].data[0].data.should.eql([{
                    type: 'sports.propositions.horizontal',
                    title: 'Aikawa v Akasha Urhobo',
                    subTitle: 'ITFW Naples',
                    matchId: 'AikavAkas',
                    betOption: 'Head To Head',
                    inPlay: false,
                    goingInPlay: false,
                    startTime: '2022-03-10T14:00:00.000Z',
                    displayTime: '2022-03-10T14:00:00.000Z',
                    hasVision: false,
                    promoAvailable: false,
                    marketsCount: 1,
                    onlineBetting: true,
                    phoneBettingOnly: false,
                    icon: { appIconIdentifier: 'tennis', imageURL: '', keepOriginalColor: false },
                    markets: [
                      {
                        allowMulti: true,
                        cashOutEligibility: 'PreMatch',
                        message: 'Match must be completed for bet to stand',
                        onlineBetting: true,
                        phoneBettingOnly: false,
                        propositions: [
                          {
                            allowPlace: false,
                            bettingStatus: 'Open',
                            id: '491755',
                            isOpen: true,
                            name: 'Aikawa',
                            number: 491755,
                            numberId: 491755,
                            position: 'HOME',
                            returnPlace: 0,
                            returnWin: 1.4,
                            sortOrder: 1,
                          },
                          {
                            allowPlace: false,
                            bettingStatus: 'Open',
                            id: '491756',
                            isOpen: true,
                            name: 'Akasha Urhobo',
                            number: 491756,
                            numberId: 491756,
                            position: 'AWAY',
                            returnPlace: 0,
                            returnWin: 2.7,
                            sortOrder: 2,
                          },
                        ],
                      },
                    ],
                    navigation: {
                      template: 'screen:sport:match',
                      discoveryKey: 'bff:sports:tournament-match:page',
                      params: {
                        sportName: 'Tennis', competitionName: 'ITF Womens', tournamentName: 'ITFW Naples', matchName: 'Aikawa v Akasha Urhobo',
                      },
                    },
                  }, {
                    type: 'sports.propositions.horizontal',
                    title: 'Mika Dagan Fruch v Gailis',
                    subTitle: 'ITFW Naples',
                    matchId: 'MikavGail',
                    betOption: 'Head To Head',
                    inPlay: false,
                    goingInPlay: false,
                    startTime: '2022-03-10T14:00:00.000Z',
                    displayTime: '2022-03-10T14:00:00.000Z',
                    hasVision: false,
                    promoAvailable: false,
                    marketsCount: 1,
                    onlineBetting: true,
                    phoneBettingOnly: false,
                    icon: { appIconIdentifier: 'tennis', imageURL: '', keepOriginalColor: false },
                    markets: [
                      {
                        allowMulti: true,
                        cashOutEligibility: 'PreMatch',
                        message: 'Match must be completed for bet to stand',
                        onlineBetting: true,
                        phoneBettingOnly: false,
                        propositions: [
                          {
                            allowPlace: false,
                            bettingStatus: 'Open',
                            id: '408681',
                            isOpen: true,
                            name: 'Mika Dagan Fruch',
                            number: 408681,
                            numberId: 408681,
                            position: 'HOME',
                            returnPlace: 0,
                            returnWin: 2.35,
                            sortOrder: 1,
                          },
                          {
                            allowPlace: false,
                            bettingStatus: 'Open',
                            id: '408683',
                            isOpen: true,
                            name: 'Gailis',
                            number: 408683,
                            numberId: 408683,
                            position: 'AWAY',
                            returnPlace: 0,
                            returnWin: 1.52,
                            sortOrder: 2,
                          },
                        ],
                      },
                    ],
                    navigation: {
                      template: 'screen:sport:match',
                      discoveryKey: 'bff:sports:tournament-match:page',
                      params: {
                        sportName: 'Tennis', competitionName: 'ITF Womens', tournamentName: 'ITFW Naples', matchName: 'Mika Dagan Fruch v Gailis',
                      },
                    },
                  }, {
                    type: 'sports.propositions.horizontal',
                    title: 'Qavia Lopez v Sysoeva',
                    subTitle: 'ITFW Naples',
                    matchId: 'QavivSyso',
                    betOption: 'Head To Head',
                    inPlay: false,
                    goingInPlay: false,
                    startTime: '2022-03-10T14:00:00.000Z',
                    displayTime: '2022-03-10T14:00:00.000Z',
                    hasVision: false,
                    promoAvailable: false,
                    marketsCount: 1,
                    onlineBetting: true,
                    phoneBettingOnly: false,
                    icon: { appIconIdentifier: 'tennis', imageURL: '', keepOriginalColor: false },
                    markets: [
                      {
                        allowMulti: true,
                        cashOutEligibility: 'PreMatch',
                        message: 'Match must be completed for bet to stand',
                        onlineBetting: true,
                        phoneBettingOnly: false,
                        propositions: [
                          {
                            allowPlace: false,
                            bettingStatus: 'Open',
                            id: '408682',
                            isOpen: true,
                            name: 'Qavia Lopez',
                            number: 408682,
                            numberId: 408682,
                            position: 'HOME',
                            returnPlace: 0,
                            returnWin: 1.22,
                            sortOrder: 1,
                          },
                          {
                            allowPlace: false,
                            bettingStatus: 'Open',
                            id: '408684',
                            isOpen: true,
                            name: 'Sysoeva',
                            number: 408684,
                            numberId: 408684,
                            position: 'AWAY',
                            returnPlace: 0,
                            returnWin: 3.8,
                            sortOrder: 2,
                          },
                        ],
                      },
                    ],
                    navigation: {
                      template: 'screen:sport:match',
                      discoveryKey: 'bff:sports:tournament-match:page',
                      params: {
                        sportName: 'Tennis', competitionName: 'ITF Womens', tournamentName: 'ITFW Naples', matchName: 'Qavia Lopez v Sysoeva',
                      },
                    },
                  }]);
                });
              });
            });
          });
        });
      });
      describe('for Mexico Open with Winner bet type', () => {
        beforeEach(async () => {
          requestCache.fetchInfo.withArgs('info:sports:sport').resolves(golf);
          requestCache.fetchInfo.withArgs('info:competiton:tournament').resolves(mexicoOpen);
          response = JSON.parse(JSON.stringify(
            await tournamentController.page(
              {
                params: {
                  sportName: 'Golf',
                  competitionName: 'US PGA Tour',
                  tournamentName: 'Mexico Open',
                },
                query: {
                  jurisdiction: 'NSW',
                  version: '12.3.0',
                },
              },
              res,
              next,
            ),
          ));
        });

        it('has type "sports.sport.competition"', () => {
          response.type.should.eql('sports.sport.competition');
        });

        it('has sport name "Golf"', () => {
          response.sportName.should.eql('Golf');
        });

        it('has title "Mexico Open"', () => {
          response.title.should.eql('Mexico Open');
        });

        describe('has data', () => {
          it('with two items', () => {
            response.data.length.should.eql(2);
          });

          describe('first item', () => {
            it('has type "sports.competition.list"', () => {
              response.data[0].type.should.eql('sports.competition.list');
            });

            it('has title "Golf"', () => {
              response.data[0].title.should.eql('Golf');
            });

            it('has discovery key "bff:sports:sport"', () => {
              response.data[0].discoveryKey.should.eql('bff:sports:sport');
            });

            it('has refresh rate 30', () => {
              response.data[0].refreshRate.should.eql(30);
            });

            it('has correct data', () => {
              response.data[0].data.should.eql([
                {
                  name: 'Mexico Open',
                  displayName: 'Mexico Open',
                  competitionName: 'US PGA Tour',
                  active: true,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'Catalunya Championship',
                  displayName: 'Catalunya Championship',
                  competitionName: 'DP World Tour',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'Ryder Cup',
                  displayName: 'Ryder Cup',
                  competitionName: 'Ryder Cup',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'Palos Verdes Championship',
                  displayName: 'Palos Verdes Championship',
                  competitionName: 'US LPGA Tour',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'Insperity Invitational',
                  displayName: 'Insperity Invitational',
                  competitionName: 'Senior PGA Tour',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'PGA Championship',
                  displayName: 'PGA Championship',
                  competitionName: 'PGA Championship',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'British Open',
                  displayName: 'British Open',
                  competitionName: 'British Open',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'US Open',
                  displayName: 'US Open',
                  competitionName: 'US Open',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'US Masters',
                  displayName: 'US Masters',
                  competitionName: 'US Masters',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'Presidents Cup',
                  displayName: 'Presidents Cup',
                  competitionName: 'Presidents Cup',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'European Golf Futures',
                  displayName: 'European Golf Futures',
                  competitionName: 'Golf Futures',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'US Golf Futures',
                  displayName: 'US Golf Futures',
                  competitionName: 'Golf Futures',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'To Win a Major',
                  displayName: 'To Win a Major',
                  competitionName: 'To Win a Major',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'Cameron Smith Majors Offer',
                  displayName: 'Cameron Smith Majors Offer',
                  competitionName: '2022 Player Offers',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
                {
                  name: 'Number of Major Wins',
                  displayName: 'Number of Major Wins',
                  competitionName: 'Number of Major Wins',
                  active: false,
                  sameGame: false,
                  promoAvailable: false,
                  discoveryKey: 'bff:sports:tournament',
                },
              ]);
            });
          });

          describe('second item', () => {
            it('has type "sports.competition.betOptions"', () => {
              response.data[1].type.should.eql('sports.competition.betOptions');
            });

            it('has default odds count 4', () => {
              response.data[1].defaultOddsCount.should.eql(4);
            });

            it('has default odds buffer 1', () => {
              response.data[1].oddsCountBuffer.should.eql(1);
            });

            describe('has data', () => {
              it('with one items', () => {
                response.data[1].data.length.should.eql(1);
              });

              describe('first item', () => {
                it('has type app.sports.timeGroups', () => {
                  response.data[1].data[0].type.should.eql('app.sports.timeGroups');
                });

                it('has groups with thisYear & nextYear if version is > 12.4.1', async () => {
                  response = JSON.parse(JSON.stringify(
                    await tournamentController.page(
                      {
                        params: {
                          sportName: 'Golf',
                          competitionName: 'US PGA Tour',
                          tournamentName: 'Mexico Open',
                        },
                        query: {
                          jurisdiction: 'NSW',
                          version: '12.4.2',
                        },
                      },
                      res,
                      next,
                    ),
                  ));
                  response.data[1].data[0].groups.should.eql({
                    today: 'Today',
                    tomorrow: 'Tomorrow',
                    thisYear: 'EEEE dd MMM',
                    nextYear: 'EEEE dd MMM yyyy',
                  });
                });

                it('has groups ["Today", "Tomorrow", "dd/mm/yyyy"]', () => {
                  response.data[1].data[0].groups.should.eql(['Today', 'Tomorrow', 'dd/mm/yyyy']);
                });
                it('has data', () => {
                  response.data[1].data[0].data.should.eql([
                    {
                      type: 'sports.propositions.vertical',
                      title: 'Mexico Open',
                      subTitle: 'Mexico Open',
                      matchId: 'Mexico_Op',
                      betOption: 'Winner',
                      inPlay: false,
                      goingInPlay: false,
                      startTime: '2022-05-01T15:00:00.000Z',
                      displayTime: '2022-05-01T15:00:00.000Z',
                      onlineBetting: true,
                      phoneBettingOnly: false,
                      hasVision: false,
                      promoAvailable: false,
                      marketsCount: 17,
                      icon: {
                        appIconIdentifier: 'golf',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          cashOutEligibility: 'Enabled',
                          message: 'Includes Playoff',
                          allowMulti: true,
                          onlineBetting: true,
                          phoneBettingOnly: false,
                          propositions: [
                            {
                              id: '840099',
                              numberId: 840099,
                              number: 840099,
                              name: 'RAHM Jon',
                              sortOrder: 99,
                              returnWin: 5.5,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840001',
                              numberId: 840001,
                              number: 840001,
                              name: 'ANCER Abraham',
                              sortOrder: 1,
                              returnWin: 17,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840142',
                              numberId: 840142,
                              number: 840142,
                              name: 'WOODLAND Gary',
                              sortOrder: 142,
                              returnWin: 21,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840033',
                              numberId: 840033,
                              number: 840033,
                              name: 'FINAU Tony',
                              sortOrder: 33,
                              returnWin: 21,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840140',
                              numberId: 840140,
                              number: 840140,
                              name: 'WISE Aaron',
                              sortOrder: 140,
                              returnWin: 26,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840103',
                              numberId: 840103,
                              number: 840103,
                              name: 'REED Patrick',
                              sortOrder: 103,
                              returnWin: 26,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840086',
                              numberId: 840086,
                              number: 840086,
                              name: 'NA Kevin',
                              sortOrder: 86,
                              returnWin: 26,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840084',
                              numberId: 840084,
                              number: 840084,
                              name: 'MUNOZ Sebastian',
                              sortOrder: 84,
                              returnWin: 26,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840063',
                              numberId: 840063,
                              number: 840063,
                              name: 'KIRK Chris',
                              sortOrder: 63,
                              returnWin: 29,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840129',
                              numberId: 840129,
                              number: 840129,
                              name: 'TRINGALE Cameron',
                              sortOrder: 129,
                              returnWin: 31,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840117',
                              numberId: 840117,
                              number: 840117,
                              name: 'STREELMAN Kevin',
                              sortOrder: 117,
                              returnWin: 34,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840060',
                              numberId: 840060,
                              number: 840060,
                              name: 'JONES Matt',
                              sortOrder: 60,
                              returnWin: 34,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840100',
                              numberId: 840100,
                              number: 840100,
                              name: 'RAI Aaron',
                              sortOrder: 100,
                              returnWin: 41,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840019',
                              numberId: 840019,
                              number: 840019,
                              name: 'CHAMP Cameron',
                              sortOrder: 19,
                              returnWin: 41,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '840126',
                              numberId: 840126,
                              number: 840126,
                              name: 'TODD Brendon',
                              sortOrder: 126,
                              returnWin: 51,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                          ],
                        },
                      ],
                      navigation: {
                        template: 'screen:sport:match',
                        discoveryKey: 'bff:sports:tournament-match:page',
                        params: {
                          sportName: 'Golf',
                          competitionName: 'US PGA Tour',
                          tournamentName: 'Mexico Open',
                          matchName: 'Mexico Open',
                        },
                      },
                    },
                    {
                      type: 'sports.propositions.empty',
                      title: 'Mexico Open  R1 Aus LS',
                      subTitle: 'Mexico Open',
                      matchId: 'MO_R1_ALS',
                      inPlay: false,
                      goingInPlay: false,
                      startTime: '2022-04-28T12:00:00.000Z',
                      displayTime: '2022-04-28T12:00:00.000Z',
                      hasVision: false,
                      promoAvailable: false,
                      marketsCount: 1,
                      icon: {
                        appIconIdentifier: 'golf',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [],
                      navigation: {
                        template: 'screen:sport:match',
                        discoveryKey: 'bff:sports:tournament-match:page',
                        params: {
                          sportName: 'Golf',
                          competitionName: 'US PGA Tour',
                          tournamentName: 'Mexico Open',
                          matchName: 'Mexico Open  R1 Aus LS',
                        },
                      },
                    },
                    {
                      type: 'sports.propositions.empty',
                      title: 'Mexico Open  R1 LowScr',
                      subTitle: 'Mexico Open',
                      matchId: 'MO_R1_LS',
                      inPlay: false,
                      goingInPlay: false,
                      startTime: '2022-05-01T15:00:01.000Z',
                      displayTime: '2022-04-28T12:00:00.000Z',
                      hasVision: false,
                      promoAvailable: false,
                      marketsCount: 1,
                      icon: {
                        appIconIdentifier: 'golf',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [],
                      navigation: {
                        template: 'screen:sport:match',
                        discoveryKey: 'bff:sports:tournament-match:page',
                        params: {
                          sportName: 'Golf',
                          competitionName: 'US PGA Tour',
                          tournamentName: 'Mexico Open',
                          matchName: 'Mexico Open  R1 LowScr',
                        },
                      },
                    },
                    {
                      type: 'sports.propositions.empty',
                      title: 'Mexico Open  R1LS Top5',
                      subTitle: 'Mexico Open',
                      matchId: 'MO_R1LST5',
                      inPlay: false,
                      goingInPlay: false,
                      startTime: '2022-04-28T12:00:00.000Z',
                      displayTime: '2022-04-28T12:00:00.000Z',
                      hasVision: false,
                      promoAvailable: false,
                      marketsCount: 1,
                      icon: {
                        appIconIdentifier: 'golf',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [],
                      navigation: {
                        template: 'screen:sport:match',
                        discoveryKey: 'bff:sports:tournament-match:page',
                        params: {
                          sportName: 'Golf',
                          competitionName: 'US PGA Tour',
                          tournamentName: 'Mexico Open',
                          matchName: 'Mexico Open  R1LS Top5',
                        },
                      },
                    },
                    {
                      type: 'sports.propositions.empty',
                      title: 'Mexico Open  TrnHH',
                      subTitle: 'Mexico Open',
                      matchId: 'MO_Trn_HH',
                      inPlay: false,
                      goingInPlay: false,
                      startTime: '2022-04-28T12:00:00.000Z',
                      displayTime: '2022-04-28T12:00:00.000Z',
                      hasVision: false,
                      promoAvailable: false,
                      marketsCount: 6,
                      icon: {
                        appIconIdentifier: 'golf',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [],
                      navigation: {
                        template: 'screen:sport:match',
                        discoveryKey: 'bff:sports:tournament-match:page',
                        params: {
                          sportName: 'Golf',
                          competitionName: 'US PGA Tour',
                          tournamentName: 'Mexico Open',
                          matchName: 'Mexico Open  TrnHH',
                        },
                      },
                    },
                  ]);
                });
              });
            });
          });
        });
      });
    });

    describe('when info-wift throws an error', () => {
      beforeEach(async () => {
        sinon.stub(log, 'error').callsFake(() => { });

        requestCache.fetchInfo.throws();

        response = JSON.parse(JSON.stringify(
          await tournamentController.page(
            {
              params: {
                sportName: 'Tennis',
                competitionName: 'ITF Womens',
                tournamentName: 'ITFW Naples',
              },
              query: {
                jurisdiction: 'QLD',
                platform: 'mobile',
                os: 'ios',
                version: '1.0.0',
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
            message: 'Error fetching tournament details.',
          },
        });
      });
    });
  });
});
