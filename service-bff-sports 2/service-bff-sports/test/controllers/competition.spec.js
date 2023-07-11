const sinon = require('sinon');

const promoVisibility = require('../mocks/aem/sport.promo.visbility.json');
const ncaaBasketball = require('../mocks/info-wift/competitions/ncaa-basketball.json');
const uefaEuropaLeague = require('../mocks/info-wift/competitions/uefa-europa-league.json');
const ncaaBasketballResults = require('../mocks/info-wift/results/ncaa-basketball.json');
const basketball = require('../mocks/info-wift/sports/basketball.json');
const soccer = require('../mocks/info-wift/sports/soccer.json');

const competitionController = require(`${global.SRC}/controllers/competition`);
const log = require(`${global.SRC}/log`);
const requestCache = require(`${global.SRC}/request-cache`);
const request = require(`${global.SRC}/request`);

describe('Competition controller', () => {
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
      requestCache.fetchInfo.withArgs('info:competition:matches:results').resolves(ncaaBasketballResults);

      response = JSON.parse(JSON.stringify(
        await competitionController.results(
          {
            params: {
              sportName: 'Basketball',
              competitionName: 'NCAA Basketball',
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

    it('has type "sports.competition.results"', () => {
      response.type.should.eql('sports.competition.results');
    });

    it('has title "[Competition Name] Results"', () => {
      response.title.should.eql('NCAA Basketball Results');
    });

    it('has discovery key "bff:sports:competition:results"', () => {
      response.discoveryKey.should.eql('bff:sports:competition:results');
    });

    describe('has data', () => {
      it('with the same number of matches as the info service response', () => {
        response.data.length.should.eql(ncaaBasketballResults.matches.length);
      });

      it('with the correct matches', () => {
        response.data.should.eql([
          {
            name: 'Boston College v Florida State',
            displayName: 'Boston College v Florida State',
            spectrumId: 'BosCvFSU',
            navigation: {
              template: 'match:results',
              discoveryKey: 'bff:sports:match:results',
              params: {
                sportName: 'Basketball',
                competitionName: 'NCAA Basketball',
                matchName: 'Boston College v Florida State',
              },
            },
          },
          {
            name: 'ArknsasPineBluff v Texas Southern',
            displayName: 'ArknsasPineBluff v Texas Southern',
            spectrumId: 'UAPBvTxSo',
            navigation: {
              template: 'match:results',
              discoveryKey: 'bff:sports:match:results',
              params: {
                sportName: 'Basketball',
                competitionName: 'NCAA Basketball',
                matchName: 'ArknsasPineBluff v Texas Southern',
              },
            },
          },
          {
            name: 'Bethune-Cookman v Alabama State',
            displayName: 'Bethune-Cookman v Alabama State',
            spectrumId: 'BCoovAlSt',
            navigation: {
              template: 'match:results',
              discoveryKey: 'bff:sports:match:results',
              params: {
                sportName: 'Basketball',
                competitionName: 'NCAA Basketball',
                matchName: 'Bethune-Cookman v Alabama State',
              },
            },
          },
        ]);
      });
    });
  });

  describe('Page response', () => {
    let queryParams;
    describe('when info-wift works', () => {
      describe('for NCAA Basketball', () => {
        beforeEach(async () => {
          sinon.useFakeTimers(Date.parse('2022-09-09T00:00:00.000Z'));
          requestCache.fetchInfo.withArgs('info:sports:sport').resolves(basketball);
          requestCache.fetchInfo.withArgs('info:sport:competiton').resolves(ncaaBasketball);
          requestCache.fetchAem.withArgs('promo').resolves(promoVisibility);
          queryParams = {
            jurisdiction: 'QLD',
            activeChip: 'Head To Head',
            version: '12.3.0',
          };

          response = JSON.parse(JSON.stringify(
            await competitionController.page(
              {
                params: {
                  sportName: 'Basketball',
                  competitionName: 'NCAA Basketball',
                },
                query: queryParams,
              },
              res,
              next,
            ),
          ));
        });

        it('has type "sports.sport.competition"', () => {
          response.type.should.eql('sports.sport.competition');
        });

        it('has sport name "Basketball"', () => {
          response.sportName.should.eql('Basketball');
        });

        it('has title "NCAA Basketball"', () => {
          response.title.should.eql('NCAA Basketball');
        });

        describe('has data', () => {
          it('with three items', () => {
            response.data.length.should.eql(3);
          });

          describe('first item', () => {
            it('has type "sports.competition.list"', () => {
              response.data[0].type.should.eql('sports.competition.list');
            });

            it('has title "Basketball"', () => {
              response.data[0].title.should.eql('Basketball');
            });

            it('has discovery key "bff:sports:sport"', () => {
              response.data[0].discoveryKey.should.eql('bff:sports:sport');
            });

            it('has refresh rate 30', () => {
              response.data[0].refreshRate.should.eql(30);
            });

            it('has correct data', () => {
              response.data[0].data.should.eql([{
                name: 'NBA',
                displayName: 'NBA',
                sameGame: true,
                active: false,
                promoAvailable: false,
                discoveryKey: 'bff:sports:competition',
              },
              {
                name: 'NBL',
                displayName: 'NBL',
                sameGame: true,
                active: false,
                promoAvailable: false,
                discoveryKey: 'bff:sports:competition',
              },
              {
                name: 'NCAA Basketball',
                displayName: 'NCAA Basketball',
                sameGame: false,
                active: true,
                promoAvailable: true,
                discoveryKey: 'bff:sports:competition',
              }]);
            });
          });

          describe('second item', () => {
            it('has type "sports.competition.promo"', () => {
              response.data[1].type.should.eql('sports.competition.promo');
            });

            it('has data', () => {
              response.data[1].data[0].promoText.should.eql('NBA - September 4+ Legs, 1 Fails');
              response.data[1].data[0].should.eql({
                icon: {
                  appIconIdentifier: 'app_promo_offers',
                  imageURL: '',
                  keepOriginalColor: true,
                },
                promoText: 'NBA - September 4+ Legs, 1 Fails',
                promoDetails: '<!DOCTYPE html><html><head><meta http-equiv="content-type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><script type="text/javascript">function invokeNative(){if (MessageInvoker && typeof MessageInvoker.postMessage === \'function\'){MessageInvoker.postMessage(\'Bet now\');}}</script><style>html{box-sizing:border-box;font-family:\'Inter\',sans-serif;font-size:16px;font-style:normal;}*,*:before,*:after{box-sizing:inherit;}body{display:flex;flex-direction:column;margin:0;min-height:100vh;}img{display:block;height:auto;max-width:100%;}.content{color:rgba(51,51,51,0.69);flex:1;font-weight:400;margin:2rem 1rem 1rem 1rem;}.footer{background:#ffffff;bottom:0;padding:1.5rem 1rem 1rem 1rem;position:sticky;width:100%;}.learn-more{margin-bottom:3.75rem;text-align:center;}.terms{font-size:0.75rem;line-height:1rem;}.bet-now{background:#008542;border:none;border-radius:6px;color:#ffffff;font-size:1rem;font-weight:600;line-height:1.25rem;padding:0.75rem 1rem;width:100%;}.learn-more-title{color:#191919;font-size:1.25rem;font-weight:600;line-height:1.5rem;margin-bottom:1rem;}.learn-more-details{font-size:1rem;line-height:1.25rem;}.terms-title{font-weight:600;margin-bottom:0.5rem;}</style></head><body><img src="https:&#x2F;&#x2F;congo.cmsapi.tab.com.au&#x2F;content&#x2F;dam&#x2F;tab-digital&#x2F;job-number---campaign-name&#x2F;owned&#x2F;promo-visibility&#x2F;8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg" /><div class="content"><div class="learn-more"><div class="learn-more-title">NBA - 29 July MLB H2H Multi Offer</div><div class="learn-more-details">Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,..&#x2F;;&#39;]]\\&#x3D;-&#x60;1adsfasdfaasTips:&lt;h3&gt;What are legal terms?&lt;&#x2F;h3&gt;Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.</div></div><div class="terms"><div class="terms-title">Terms & Conditions</div><div><br/>Tips:&lt;h3&gt;What are legal terms?&lt;&#x2F;h3&gt;Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.&lt;b&gt; Does Termly&#39;s legal terms generator cover all contract and consumer protection laws?&lt;&#x2F;b&gt;<br/>Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br/><br/><br/>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.&nbsp;Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.</div></div></div><div class="footer"><button type="button" class="bet-now" onclick="invokeNative()">Bet Now</button></div></body></html>',
              });
            });
          });

          describe('third item', () => {
            it('has type "sports.competition.betOptions"', () => {
              response.data[2].type.should.eql('sports.competition.betOptions');
            });

            it('has filters', () => {
              response.data[2].filters.length.should.eql(4);
            });

            it('has filter object with all properties', () => {
              response.data[2].filters[0].should.eql({
                title: 'H2H',
                name: 'Head To Head',
                discoveryKey: 'bff:sports:competition',
                active: true,
              });
            });

            describe('has data', () => {
              it('with two items', () => {
                response.data[2].data.length.should.eql(2);
              });

              describe('first item', () => {
                it('has title "In-Play"', () => {
                  response.data[2].data[0].title.should.eql('In-Play');
                });
                it('has correct data', () => {
                  response.data[2].data[0].data.should.eql([
                    {
                      type: 'sports.propositions.horizontal',
                      title: 'Cal Baptist v UTRGV',
                      subTitle: 'NCAA Basketball',
                      matchId: 'CBUvUTRG',
                      betOption: 'Head To Head',
                      inPlay: true,
                      goingInPlay: false,
                      startTime: '2022-03-09T02:00:00.000Z',
                      displayTime: '2022-03-09T02:00:00.000Z',
                      hasVision: false,
                      promoAvailable: true,
                      marketsCount: 5,
                      onlineBetting: false,
                      phoneBettingOnly: true,
                      icon: {
                        appIconIdentifier: 'basketball',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          allowMulti: true,
                          cashOutEligibility: 'Enabled',
                          message: null,
                          onlineBetting: false,
                          phoneBettingOnly: true,
                          propositions: [
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '617794',
                              isOpen: true,
                              name: 'Cal Baptist',
                              number: 617794,
                              numberId: 617794,
                              position: 'HOME',
                              returnPlace: 0,
                              returnWin: 1.16,
                              sortOrder: 1,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '617795',
                              isOpen: true,
                              name: 'UTRGV',
                              number: 617795,
                              numberId: 617795,
                              position: 'AWAY',
                              returnPlace: 0,
                              returnWin: 4.6,
                              sortOrder: 2,
                            },
                          ],
                        }],
                      navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NCAA Basketball', matchName: 'Cal Baptist v UTRGV' } },
                    },
                    {
                      type: 'sports.propositions.horizontal',
                      title: 'CSU Northridge v CSU Bakersfield',
                      subTitle: 'NCAA Basketball',
                      matchId: 'CSUNvCSBk',
                      betOption: 'Head To Head',
                      inPlay: true,
                      goingInPlay: false,
                      startTime: '2022-03-09T02:00:00.000Z',
                      displayTime: '2022-03-09T02:00:00.000Z',
                      hasVision: false,
                      promoAvailable: true,
                      marketsCount: 5,
                      onlineBetting: false,
                      phoneBettingOnly: true,
                      icon: {
                        appIconIdentifier: 'basketball',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          allowMulti: true,
                          cashOutEligibility: 'Enabled',
                          message: null,
                          onlineBetting: false,
                          phoneBettingOnly: true,
                          propositions: [
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              icon: {
                                imageURL: 'some/image/url.svg',
                              },
                              id: '617024',
                              isOpen: true,
                              name: 'CSU Northridge',
                              number: 617024,
                              numberId: 617024,
                              position: 'HOME',
                              returnPlace: 0,
                              returnWin: 2.7,
                              sortOrder: 1,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              icon: {
                                imageURL: 'some/image/url.svg',
                              },
                              id: '617025',
                              isOpen: true,
                              name: 'CSU Bakersfield',
                              number: 617025,
                              numberId: 617025,
                              position: 'AWAY',
                              returnPlace: 0,
                              returnWin: 1.4,
                              sortOrder: 2,
                            },
                          ],
                        }],
                      navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NCAA Basketball', matchName: 'CSU Northridge v CSU Bakersfield' } },
                    },
                  ]);
                });
              });

              describe('second item', () => {
                it('has type app.sports.timeGroups', () => {
                  response.data[2].data[1].type.should.eql('app.sports.timeGroups');
                });

                it('has groups with thisYear & nextYear if version is > 12.4.1', async () => {
                  queryParams.version = '12.4.2';
                  response = JSON.parse(JSON.stringify(
                    await competitionController.page(
                      {
                        params: {
                          sportName: 'Basketball',
                          competitionName: 'NCAA Basketball',
                        },
                        query: queryParams,
                      },
                      res,
                      next,
                    ),
                  ));
                  response.data[2].data[1].groups.should.eql({
                    today: 'Today',
                    tomorrow: 'Tomorrow',
                    thisYear: 'EEEE dd MMM',
                    nextYear: 'EEEE dd MMM yyyy',
                  });
                });

                it('has groups ["Today", "Tomorrow", "dd/mm/yyyy"]', () => {
                  response.data[2].data[1].groups.should.eql(['Today', 'Tomorrow', 'dd/mm/yyyy']);
                });

                it('has correct data', () => {
                  response.data[2].data[1].data.should.eql([
                    {
                      type: 'sports.propositions.horizontal',
                      title: 'Marist v Quinnipiac',
                      subTitle: 'NCAA Basketball',
                      matchId: 'MrstvQnpc',
                      betOption: 'Head To Head',
                      inPlay: false,
                      goingInPlay: true,
                      startTime: '2022-03-09T03:00:00.000Z',
                      displayTime: '2022-03-09T03:00:00.000Z',
                      hasVision: false,
                      promoAvailable: true,
                      marketsCount: 24,
                      onlineBetting: true,
                      phoneBettingOnly: false,
                      icon: {
                        appIconIdentifier: 'basketball',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          allowMulti: true,
                          cashOutEligibility: 'Enabled',
                          message: null,
                          onlineBetting: true,
                          phoneBettingOnly: false,
                          propositions: [
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '617757',
                              isOpen: true,
                              name: 'Marist',
                              number: 617757,
                              numberId: 617757,
                              position: 'HOME',
                              returnPlace: 0,
                              returnWin: 1.67,
                              sortOrder: 1,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '617758',
                              isOpen: true,
                              name: 'Quinnipiac',
                              number: 617758,
                              numberId: 617758,
                              position: 'AWAY',
                              returnPlace: 0,
                              returnWin: 2.2,
                              sortOrder: 2,
                            },
                          ],
                        }],
                      navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NCAA Basketball', matchName: 'Marist v Quinnipiac' } },
                    },
                    {
                      type: 'sports.propositions.horizontal',
                      title: 'UC Davis v Cal Poly',
                      subTitle: 'NCAA Basketball',
                      matchId: 'UCDvvCPly',
                      betOption: 'Head To Head',
                      inPlay: false,
                      goingInPlay: true,
                      startTime: '2022-03-09T04:30:00.000Z',
                      displayTime: '2022-03-09T04:30:00.000Z',
                      hasVision: false,
                      promoAvailable: true,
                      marketsCount: 23,
                      onlineBetting: true,
                      phoneBettingOnly: false,
                      icon: {
                        appIconIdentifier: 'basketball',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          allowMulti: true,
                          cashOutEligibility: 'Enabled',
                          message: null,
                          onlineBetting: true,
                          phoneBettingOnly: false,
                          propositions: [
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '617044',
                              isOpen: true,
                              name: 'UC Davis',
                              number: 617044,
                              numberId: 617044,
                              position: 'HOME',
                              returnPlace: 0,
                              returnWin: 1.37,
                              sortOrder: 1,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '617045',
                              isOpen: true,
                              name: 'Cal Poly',
                              number: 617045,
                              numberId: 617045,
                              position: 'AWAY',
                              returnPlace: 0,
                              returnWin: 3.15,
                              sortOrder: 2,
                            },
                          ],
                        }],
                      navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NCAA Basketball', matchName: 'UC Davis v Cal Poly' } },
                    },
                    {
                      type: 'sports.propositions.horizontal',
                      title: 'Vanderbilt v Georgia',
                      subTitle: 'NCAA Basketball',
                      matchId: 'VabivGrga',
                      betOption: 'Head To Head',
                      inPlay: false,
                      goingInPlay: true,
                      startTime: '2022-03-10T01:30:00.000Z',
                      displayTime: '2022-03-10T01:30:00.000Z',
                      hasVision: false,
                      promoAvailable: true,
                      marketsCount: 3,
                      onlineBetting: true,
                      phoneBettingOnly: false,
                      icon: {
                        appIconIdentifier: 'basketball',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          allowMulti: true,
                          cashOutEligibility: 'Enabled',
                          message: null,
                          onlineBetting: true,
                          phoneBettingOnly: false,
                          propositions: [
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '631621',
                              isOpen: true,
                              name: 'Vanderbilt',
                              number: 631621,
                              numberId: 631621,
                              position: 'HOME',
                              returnPlace: 0,
                              returnWin: 1.23,
                              sortOrder: 1,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '631622',
                              isOpen: true,
                              name: 'Georgia',
                              number: 631622,
                              numberId: 631622,
                              position: 'AWAY',
                              returnPlace: 0,
                              returnWin: 4.2,
                              sortOrder: 2,
                            },
                          ],
                          shortName: 'Col Vabi-Grga Hd to Hd',
                        },
                        {
                          allowMulti: true,
                          cashOutEligibility: 'Enabled',
                          message: null,
                          onlineBetting: true,
                          phoneBettingOnly: false,
                          propositions: [
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '641621',
                              isOpen: true,
                              name: 'Vanderbilt',
                              number: 641621,
                              numberId: 641621,
                              position: 'HOME',
                              returnPlace: 0,
                              returnWin: 1.23,
                              sortOrder: 1,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '641622',
                              isOpen: true,
                              name: 'Georgia',
                              number: 641621,
                              numberId: 641621,
                              position: 'AWAY',
                              returnPlace: 0,
                              returnWin: 4.2,
                              sortOrder: 2,
                            },
                          ],
                          shortName: 'Col Vabi-Grga Hd to Hd',
                        },
                      ],
                      navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NCAA Basketball', matchName: 'Vanderbilt v Georgia' } },
                    },
                    {
                      type: 'sports.propositions.empty',
                      title: 'Washington State v California',
                      subTitle: 'NCAA Basketball',
                      matchId: 'WshSvCal',
                      inPlay: false,
                      goingInPlay: true,
                      startTime: '2022-03-10T02:00:00.000Z',
                      displayTime: '2022-03-10T02:00:00.000Z',
                      hasVision: false,
                      promoAvailable: true,
                      marketsCount: 3,
                      icon: {
                        appIconIdentifier: 'basketball',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [],
                      navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Basketball', competitionName: 'NCAA Basketball', matchName: 'Washington State v California' } },
                    },
                  ]);
                });
              });
            });
          });
        });
      });
      describe('for NCAA Basketball with vertical proposition', () => {
        beforeEach(async () => {
          sinon.useFakeTimers(Date.parse('2022-09-09T00:00:00.000Z'));
          requestCache.fetchInfo.withArgs('info:sports:sport').resolves(basketball);
          requestCache.fetchInfo.withArgs('info:sport:competiton').resolves(ncaaBasketball);
          requestCache.fetchAem.withArgs('promo').resolves(promoVisibility);
          response = JSON.parse(JSON.stringify(
            await competitionController.page(
              {
                params: {
                  sportName: 'Basketball',
                  competitionName: 'NCAA Basketball',
                },
                query: {
                  jurisdiction: 'QLD',
                  activeChip: 'Line',
                  version: '12.3.0',
                },
              },
              res,
              next,
            ),
          ));
        });

        describe('has data with no icon property in proposition for Line betoption', () => {
          it('with three items', () => {
            response.data.length.should.eql(3);
          });

          describe('third item', () => {
            it('has type "sports.competition.betOptions"', () => {
              response.data[2].type.should.eql('sports.competition.betOptions');
            });

            it('has filter object with all properties', () => {
              response.data[2].filters[1].should.eql({
                title: 'Line',
                name: 'Line',
                discoveryKey: 'bff:sports:competition',
                active: true,
              });
            });

            describe('has data', () => {
              it('with two items', () => {
                response.data[2].data.length.should.eql(2);
              });

              describe('first item', () => {
                it('has title "In-Play"', () => {
                  response.data[2].data[0].title.should.eql('In-Play');
                });
                it('has correct data', () => {
                  response.data[2].data[0].data.should.eql([
                    {
                      type: 'sports.propositions.empty',
                      title: 'Cal Baptist v UTRGV',
                      subTitle: 'NCAA Basketball',
                      matchId: 'CBUvUTRG',
                      inPlay: true,
                      goingInPlay: false,
                      startTime: '2022-03-09T02:00:00.000Z',
                      displayTime: '2022-03-09T02:00:00.000Z',
                      hasVision: false,
                      promoAvailable: true,
                      marketsCount: 5,
                      icon: {
                        appIconIdentifier: 'basketball',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [],
                      navigation: {
                        template: 'screen:sport:match',
                        discoveryKey: 'bff:sports:match:page',
                        params: {
                          sportName: 'Basketball',
                          competitionName: 'NCAA Basketball',
                          matchName: 'Cal Baptist v UTRGV',
                        },
                      },
                    },
                    {
                      type: 'sports.propositions.empty',
                      title: 'CSU Northridge v CSU Bakersfield',
                      subTitle: 'NCAA Basketball',
                      matchId: 'CSUNvCSBk',
                      inPlay: true,
                      goingInPlay: false,
                      startTime: '2022-03-09T02:00:00.000Z',
                      displayTime: '2022-03-09T02:00:00.000Z',
                      hasVision: false,
                      promoAvailable: true,
                      marketsCount: 5,
                      icon: {
                        appIconIdentifier: 'basketball',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [],
                      navigation: {
                        template: 'screen:sport:match',
                        discoveryKey: 'bff:sports:match:page',
                        params: {
                          sportName: 'Basketball',
                          competitionName: 'NCAA Basketball',
                          matchName: 'CSU Northridge v CSU Bakersfield',
                        },
                      },
                    },
                  ]);
                });
              });

              describe('second item', () => {
                it('has type app.sports.timeGroups', () => {
                  response.data[2].data[1].type.should.eql('app.sports.timeGroups');
                });

                it('has groups with thisYear & nextYear if version is > 12.4.1', async () => {
                  response = JSON.parse(JSON.stringify(
                    await competitionController.page(
                      {
                        params: {
                          sportName: 'Basketball',
                          competitionName: 'NCAA Basketball',
                        },
                        query: {
                          jurisdiction: 'QLD',
                          activeChip: 'Line',
                          version: '12.4.2',
                        },
                      },
                      res,
                      next,
                    ),
                  ));
                  response.data[2].data[1].groups.should.eql({
                    today: 'Today',
                    tomorrow: 'Tomorrow',
                    thisYear: 'EEEE dd MMM',
                    nextYear: 'EEEE dd MMM yyyy',
                  });
                });

                it('has groups ["Today", "Tomorrow", "dd/mm/yyyy"]', () => {
                  response.data[2].data[1].groups.should.eql(['Today', 'Tomorrow', 'dd/mm/yyyy']);
                });

                it('has correct data', () => {
                  response.data[2].data[1].data.should.eql([
                    {
                      type: 'sports.propositions.vertical',
                      title: 'Marist v Quinnipiac',
                      subTitle: 'NCAA Basketball',
                      matchId: 'MrstvQnpc',
                      betOption: 'Line',
                      inPlay: false,
                      goingInPlay: true,
                      startTime: '2022-03-09T03:00:00.000Z',
                      displayTime: '2022-03-09T03:00:00.000Z',
                      hasVision: false,
                      promoAvailable: true,
                      marketsCount: 24,
                      onlineBetting: true,
                      phoneBettingOnly: false,
                      icon: {
                        appIconIdentifier: 'basketball',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          cashOutEligibility: 'Enabled',
                          message: null,
                          allowMulti: true,
                          onlineBetting: true,
                          phoneBettingOnly: false,
                          propositions: [
                            {
                              id: '617759',
                              numberId: 617759,
                              number: 617759,
                              name: 'Marist -2.5',
                              sortOrder: 1,
                              returnWin: 1.9,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '617760',
                              numberId: 617760,
                              number: 617760,
                              name: 'Quinnipiac +2.5',
                              sortOrder: 2,
                              returnWin: 1.9,
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
                        discoveryKey: 'bff:sports:match:page',
                        params: {
                          sportName: 'Basketball',
                          competitionName: 'NCAA Basketball',
                          matchName: 'Marist v Quinnipiac',
                        },
                      },
                    },
                    {
                      type: 'sports.propositions.vertical',
                      title: 'UC Davis v Cal Poly',
                      subTitle: 'NCAA Basketball',
                      matchId: 'UCDvvCPly',
                      betOption: 'Line',
                      inPlay: false,
                      goingInPlay: true,
                      startTime: '2022-03-09T04:30:00.000Z',
                      displayTime: '2022-03-09T04:30:00.000Z',
                      hasVision: false,
                      promoAvailable: true,
                      marketsCount: 23,
                      onlineBetting: true,
                      phoneBettingOnly: false,
                      icon: {
                        appIconIdentifier: 'basketball',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          cashOutEligibility: 'Enabled',
                          message: null,
                          allowMulti: true,
                          onlineBetting: true,
                          phoneBettingOnly: false,
                          propositions: [
                            {
                              id: '617040',
                              numberId: 617040,
                              number: 617040,
                              name: 'UC Davis -6.5',
                              sortOrder: 1,
                              returnWin: 1.95,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '617041',
                              numberId: 617041,
                              number: 617041,
                              name: 'Cal Poly +6.5',
                              sortOrder: 2,
                              returnWin: 1.85,
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
                        discoveryKey: 'bff:sports:match:page',
                        params: {
                          sportName: 'Basketball',
                          competitionName: 'NCAA Basketball',
                          matchName: 'UC Davis v Cal Poly',
                        },
                      },
                    },
                    {
                      type: 'sports.propositions.vertical',
                      title: 'Vanderbilt v Georgia',
                      subTitle: 'NCAA Basketball',
                      matchId: 'VabivGrga',
                      betOption: 'Line',
                      inPlay: false,
                      goingInPlay: true,
                      startTime: '2022-03-10T01:30:00.000Z',
                      displayTime: '2022-03-10T01:30:00.000Z',
                      hasVision: false,
                      promoAvailable: true,
                      onlineBetting: true,
                      phoneBettingOnly: false,
                      marketsCount: 3,
                      icon: {
                        appIconIdentifier: 'basketball',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          cashOutEligibility: 'Enabled',
                          message: null,
                          allowMulti: true,
                          onlineBetting: true,
                          phoneBettingOnly: false,
                          propositions: [
                            {
                              id: '631625',
                              numberId: 631625,
                              number: 631625,
                              name: 'Vanderbilt -8.5',
                              sortOrder: 1,
                              returnWin: 1.8,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '631626',
                              numberId: 631626,
                              number: 631626,
                              name: 'Georgia +8.5',
                              sortOrder: 2,
                              returnWin: 2,
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
                        discoveryKey: 'bff:sports:match:page',
                        params: {
                          sportName: 'Basketball',
                          competitionName: 'NCAA Basketball',
                          matchName: 'Vanderbilt v Georgia',
                        },
                      },
                    },
                    {
                      type: 'sports.propositions.vertical',
                      title: 'Washington State v California',
                      subTitle: 'NCAA Basketball',
                      matchId: 'WshSvCal',
                      betOption: 'Line',
                      inPlay: false,
                      goingInPlay: true,
                      startTime: '2022-03-10T02:00:00.000Z',
                      displayTime: '2022-03-10T02:00:00.000Z',
                      hasVision: false,
                      promoAvailable: true,
                      onlineBetting: true,
                      phoneBettingOnly: false,
                      marketsCount: 3,
                      icon: {
                        appIconIdentifier: 'basketball',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          cashOutEligibility: 'Enabled',
                          message: null,
                          allowMulti: true,
                          onlineBetting: true,
                          phoneBettingOnly: false,
                          propositions: [
                            {
                              id: '631619',
                              numberId: 631619,
                              number: 631619,
                              name: 'Washington State -7.5',
                              sortOrder: 1,
                              returnWin: 1.8,
                              returnPlace: 0,
                              bettingStatus: 'Open',
                              isOpen: true,
                              allowPlace: false,
                            },
                            {
                              id: '631620',
                              numberId: 631620,
                              number: 631620,
                              name: 'California +7.5',
                              sortOrder: 2,
                              returnWin: 2,
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
                        discoveryKey: 'bff:sports:match:page',
                        params: {
                          sportName: 'Basketball',
                          competitionName: 'NCAA Basketball',
                          matchName: 'Washington State v California',
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

      describe('for UEFA Europa League', () => {
        beforeEach(async () => {
          requestCache.fetchInfo.withArgs('info:sports:sport').resolves(soccer);
          requestCache.fetchInfo.withArgs('info:sport:competiton').resolves(uefaEuropaLeague);
          queryParams = {
            jurisdiction: 'QLD',
            version: '12.3.0',
          };
          response = JSON.parse(JSON.stringify(
            await competitionController.page(
              {
                params: {
                  sportName: 'Soccer',
                  competitionName: 'UEFA Europa League',
                },
                query: queryParams,
              },
              res,
              next,
            ),
          ));
        });

        it('has type "sports.sport.competition"', () => {
          response.type.should.eql('sports.sport.competition');
        });

        it('has sport name "Soccer"', () => {
          response.sportName.should.eql('Soccer');
        });

        it('has title "UEFA Europa League"', () => {
          response.title.should.eql('UEFA Europa League');
        });

        describe('has data', () => {
          it('with two items', () => {
            response.data.length.should.eql(2);
          });

          describe('first item', () => {
            it('has type "sports.competition.list"', () => {
              response.data[0].type.should.eql('sports.competition.list');
            });

            it('has title "Soccer"', () => {
              response.data[0].title.should.eql('Soccer');
            });

            it('has discovery key "bff:sports:sport"', () => {
              response.data[0].discoveryKey.should.eql('bff:sports:sport');
            });

            it('has refresh rate 30', () => {
              response.data[0].refreshRate.should.eql(30);
            });

            it('has correct data', () => {
              response.data[0].data.should.eql([{
                name: 'UEFA Europa League',
                displayName: 'UEFA Europa League',
                sameGame: true,
                active: true,
                promoAvailable: false,
                discoveryKey: 'bff:sports:competition',
              },
              {
                name: 'A League Men',
                displayName: 'A League Men',
                sameGame: true,
                active: false,
                promoAvailable: false,
                discoveryKey: 'bff:sports:competition',
              },
              {
                name: 'English Premier League',
                displayName: 'English Premier League',
                sameGame: true,
                active: false,
                promoAvailable: false,
                discoveryKey: 'bff:sports:competition',
              }]);
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
              it('with one item', () => {
                response.data[1].data.length.should.eql(1);
              });

              describe('first item', () => {
                it('has type app.sports.timeGroups', () => {
                  response.data[1].data[0].type.should.eql('app.sports.timeGroups');
                });

                it('has groups with thisYear & nextYear if version is > 12.4.1', async () => {
                  queryParams.version = '12.4.2';
                  response = JSON.parse(JSON.stringify(
                    await competitionController.page(
                      {
                        params: {
                          sportName: 'Soccer',
                          competitionName: 'UEFA Europa League',
                        },
                        query: queryParams,
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
                  response.data[1].data[0].data.should.eql([
                    {
                      type: 'sports.propositions.horizontal',
                      title: 'RB Leipzig v Atalanta',
                      subTitle: 'UEFA Europa League',
                      matchId: 'RlpzvAlat',
                      betOption: 'Result',
                      inPlay: false,
                      goingInPlay: true,
                      startTime: '2022-04-07T16:45:00.000Z',
                      displayTime: '2022-04-07T16:45:00.000Z',
                      hasVision: true,
                      sameGame: true,
                      promoAvailable: false,
                      marketsCount: 150,
                      onlineBetting: true,
                      phoneBettingOnly: false,
                      icon: {
                        appIconIdentifier: 'soccer',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          allowMulti: true,
                          cashOutEligibility: 'Enabled',
                          message: 'Normal Time',
                          onlineBetting: true,
                          phoneBettingOnly: false,
                          sameGameMultipleSelections: false,
                          propositions: [
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '447963',
                              isOpen: true,
                              name: 'RB Leipzig',
                              number: 447963,
                              numberId: 447963,
                              position: 'HOME',
                              returnPlace: 0,
                              returnWin: 1.7,
                              sortOrder: 1,
                              sameGame: true,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '447967',
                              isOpen: true,
                              name: 'Draw',
                              number: 447967,
                              numberId: 447967,
                              position: 'DRAW',
                              returnPlace: 0,
                              returnWin: 3.9,
                              sortOrder: 2,
                              sameGame: true,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '447971',
                              isOpen: true,
                              name: 'Atalanta',
                              number: 447971,
                              numberId: 447971,
                              position: 'AWAY',
                              returnPlace: 0,
                              returnWin: 4.25,
                              sortOrder: 3,
                              sameGame: true,
                            },
                          ],
                        }],
                      navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Soccer', competitionName: 'UEFA Europa League', matchName: 'RB Leipzig v Atalanta' } },
                    },
                    {
                      type: 'sports.propositions.horizontal',
                      title: 'Braga v Rangers',
                      subTitle: 'UEFA Europa League',
                      matchId: 'BrgavRngr',
                      betOption: 'Result',
                      inPlay: false,
                      goingInPlay: true,
                      startTime: '2022-04-07T19:00:00.000Z',
                      displayTime: '2022-04-07T19:00:00.000Z',
                      hasVision: true,
                      sameGame: true,
                      promoAvailable: false,
                      marketsCount: 149,
                      onlineBetting: true,
                      phoneBettingOnly: false,
                      icon: {
                        appIconIdentifier: 'soccer',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          allowMulti: true,
                          cashOutEligibility: 'Enabled',
                          message: 'Normal Time',
                          onlineBetting: true,
                          phoneBettingOnly: false,
                          sameGameMultipleSelections: false,
                          propositions: [
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '447961',
                              isOpen: true,
                              name: 'Braga',
                              number: 447961,
                              numberId: 447961,
                              position: 'HOME',
                              returnPlace: 0,
                              returnWin: 2.25,
                              sortOrder: 1,
                              sameGame: true,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '447965',
                              isOpen: true,
                              name: 'Draw',
                              number: 447965,
                              numberId: 447965,
                              position: 'DRAW',
                              returnPlace: 0,
                              returnWin: 3.25,
                              sortOrder: 2,
                              sameGame: true,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '447968',
                              isOpen: true,
                              name: 'Rangers',
                              number: 447968,
                              numberId: 447968,
                              position: 'AWAY',
                              returnPlace: 0,
                              returnWin: 3.1,
                              sortOrder: 3,
                              sameGame: true,
                            },
                          ],
                        }],
                      navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Soccer', competitionName: 'UEFA Europa League', matchName: 'Braga v Rangers' } },
                    },
                    {
                      type: 'sports.propositions.horizontal',
                      title: 'Eint Frankfurt v Barcelona',
                      subTitle: 'UEFA Europa League',
                      matchId: 'EFftvBrca',
                      betOption: 'Result',
                      inPlay: false,
                      goingInPlay: true,
                      startTime: '2022-04-07T19:00:00.000Z',
                      displayTime: '2022-04-07T19:00:00.000Z',
                      hasVision: true,
                      sameGame: true,
                      promoAvailable: false,
                      marketsCount: 150,
                      onlineBetting: true,
                      phoneBettingOnly: false,
                      icon: {
                        appIconIdentifier: 'soccer',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          allowMulti: true,
                          cashOutEligibility: 'Enabled',
                          message: 'Normal Time',
                          onlineBetting: true,
                          phoneBettingOnly: false,
                          sameGameMultipleSelections: false,
                          propositions: [
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '447960',
                              isOpen: true,
                              name: 'Eint Frankfurt',
                              number: 447960,
                              numberId: 447960,
                              position: 'HOME',
                              returnPlace: 0,
                              returnWin: 4.5,
                              sortOrder: 1,
                              sameGame: true,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '447964',
                              isOpen: true,
                              name: 'Draw',
                              number: 447964,
                              numberId: 447964,
                              position: 'DRAW',
                              returnPlace: 0,
                              returnWin: 3.8,
                              sortOrder: 2,
                              sameGame: true,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '447969',
                              isOpen: true,
                              name: 'Barcelona',
                              number: 447969,
                              numberId: 447969,
                              position: 'AWAY',
                              returnPlace: 0,
                              returnWin: 1.7,
                              sortOrder: 3,
                              sameGame: true,
                            },
                          ],
                        }],
                      navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Soccer', competitionName: 'UEFA Europa League', matchName: 'Eint Frankfurt v Barcelona' } },
                    },
                    {
                      type: 'sports.propositions.horizontal',
                      title: 'West Ham v Lyon',
                      subTitle: 'UEFA Europa League',
                      matchId: 'WHamvLyon',
                      betOption: 'Result',
                      inPlay: false,
                      goingInPlay: true,
                      startTime: '2022-04-07T19:00:00.000Z',
                      displayTime: '2022-04-07T19:00:00.000Z',
                      hasVision: false,
                      sameGame: true,
                      promoAvailable: false,
                      marketsCount: 150,
                      onlineBetting: true,
                      phoneBettingOnly: false,
                      icon: {
                        appIconIdentifier: 'soccer',
                        imageURL: '',
                        keepOriginalColor: false,
                      },
                      markets: [
                        {
                          allowMulti: true,
                          cashOutEligibility: 'Enabled',
                          message: 'Normal Time',
                          onlineBetting: true,
                          phoneBettingOnly: false,
                          sameGameMultipleSelections: false,
                          propositions: [
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '447962',
                              isOpen: true,
                              name: 'West Ham',
                              number: 447962,
                              numberId: 447962,
                              position: 'HOME',
                              returnPlace: 0,
                              returnWin: 2,
                              sortOrder: 1,
                              sameGame: true,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '447966',
                              isOpen: true,
                              name: 'Draw',
                              number: 447966,
                              numberId: 447966,
                              position: 'DRAW',
                              returnPlace: 0,
                              returnWin: 3.4,
                              sortOrder: 2,
                              sameGame: true,
                            },
                            {
                              allowPlace: false,
                              bettingStatus: 'Open',
                              id: '447970',
                              isOpen: true,
                              name: 'Lyon',
                              number: 447970,
                              numberId: 447970,
                              position: 'AWAY',
                              returnPlace: 0,
                              returnWin: 3.6,
                              sortOrder: 3,
                              sameGame: true,
                            },
                          ],
                        }],
                      navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Soccer', competitionName: 'UEFA Europa League', matchName: 'West Ham v Lyon' } },
                    }]);
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
        sinon.stub(request, 'get').throws();

        response = JSON.parse(JSON.stringify(
          await competitionController.page(
            {
              params: {
                sportName: 'Sportsball',
                competitionName: 'League of Balls',
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
            message: 'Error fetching Competition details.',
          },
        });
      });
    });
  });
});
