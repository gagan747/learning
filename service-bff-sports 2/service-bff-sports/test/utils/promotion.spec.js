const should = require('should');
const sinon = require('sinon');

const { promotionFinder } = require(`${global.SRC}/utils`);
const config = require(`${global.SRC}/config`);

describe('promotionFinder', () => {
  const { dynamicConfig } = config.get();
  const promotions = [
    {
      authenticationStatus: 'logged-in,logged-out',
      jurisdiction: 'vic,nsw',
      bannerImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/backgrounds/3655_PromoVis_Owned_1440x168_NFL.jpeg',
      learnMoreImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg',
      inVenueOnly: 'False',
      startDate: '2022-08-15',
      endDate: '2023-11-30',
      sportType: 'Basketball',
      competition: 'NCAA Basketball',
      marketType: 'Head to Head',
      matchIds: 'GSWvBos',
      promoTitle: 'NCAA Basketball',
      betNowText: 'Bet Now',
      promoDetails: '4+ Legs, 1 Fails',
      learnMoreTitle: 'NFL Head to Head Offer',
      learnMoreDetails: "Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,../;']]\\=-`1adsfasdfaasTips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.",
      termsAndCondition: "Tips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.&nbsp;<b>Does Termly's legal terms generator cover all contract and consumer protection laws?</b><br>&nbsp;Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br><br>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.",
    },
    {
      authenticationStatus: 'logged-in,logged-out',
      jurisdiction: 'nsw,qld',
      bannerImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/backgrounds/3655_PromoVis_Owned_1440x168_Basketball.jpeg',
      learnMoreImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg',
      startDate: '2022-08-15',
      endDate: '2023-11-30',
      sportType: 'Basketball',
      competition: 'NBA',
      marketType: 'Line',
      promoTitle: 'NBA Promo',
      betNowText: 'Bet Now',
      promoDetails: 'NBA - September 4+ Legs, 1 Fails',
      learnMoreTitle: 'NBA - 29 July MLB H2H Multi Offer',
      learnMoreDetails: "Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,../;']]\\=-`1adsfasdfaasTips:<h3>What are legal terms?</h3>Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.",
      termsAndCondition: "<br>Tips:<h3>What are legal terms?</h3>Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.<b> Does Termly's legal terms generator cover all contract and consumer protection laws?</b><br>Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br><br><br>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.&nbsp;Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.",
    },
    {
      authenticationStatus: 'logged-in',
      jurisdiction: 'nt,sa',
      bannerImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/backgrounds/3655_PromoVis_Owned_1440x168_Basketball.jpeg',
      learnMoreImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg',
      startDate: '2022-08-10',
      endDate: '2023-10-30',
      sportType: 'Tennis',
      competition: 'WTPA Mens',
      marketType: 'Head to Head',
      promoTitle: 'Tennis Promo',
      betNowText: 'Bet Now',
      promoDetails: 'Logged In only',
      learnMoreTitle: 'NBA - 29 July MLB H2H Multi Offer',
      learnMoreDetails: "Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,../;']]\\=-`1adsfasdfaasTips:<h3>What are legal terms?</h3>Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.",
      termsAndCondition: "<br>Tips:<h3>What are legal terms?</h3>Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.<b> Does Termly's legal terms generator cover all contract and consumer protection laws?</b><br>Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br><br><br>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.&nbsp;Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.",
    },
  ];
  let clock;
  const fakeNow = (new Date('2023-06-14T00:00:00.000Z')).getTime();

  beforeEach(() => {
    sinon.stub(config, 'getDynamicConfig');

    config.getDynamicConfig.returns({
      ...dynamicConfig,
    });
    clock = sinon.stub(Date, 'now').returns(fakeNow);
  });

  afterEach(() => {
    sinon.restore();
    clock.restore();
  });

  it('Should find a promotion for matching sport', () => {
    const result = promotionFinder(promotions)({
      sportName: 'Basketball',
    });

    result.sportType.should.eql('Basketball');
    result.competition.should.eql('NCAA Basketball');
  });

  it('Should find a promotion for matching sport & competition', () => {
    const result = promotionFinder(promotions)({
      sportName: 'Tennis',
      competitionName: 'WTPA Mens',
    });

    result.sportType.should.eql('Tennis');
    result.competition.should.eql('WTPA Mens');
  });

  it('Should find a promotion for matching sport & competition', () => {
    const result = promotionFinder(promotions)({
      sportName: 'Tennis',
      competitionName: 'WTPA Mens',
    });

    result.sportType.should.eql('Tennis');
    result.competition.should.eql('WTPA Mens');
  });

  it('Should find a promotion for matching sport, competition & Match', () => {
    const result = promotionFinder(promotions)({
      sportName: 'Basketball',
      competitionName: 'NCAA Basketball',
      matchId: 'GSWvBos',
    });

    result.sportType.should.eql('Basketball');
    result.competition.should.eql('NCAA Basketball');
  });

  it('Should find a promotion for matching sport, competition & Market', () => {
    const result = promotionFinder(promotions)({
      sportName: 'Basketball',
      competitionName: 'NBA',
      matchId: 'GSWvBos',
      marketName: 'Line',
    });

    result.sportType.should.eql('Basketball');
    result.competition.should.eql('NBA');
  });

  it('Should find a promotion for tournament if it matches', () => {
    const result = promotionFinder(promotions)({
      sportName: 'Basketball',
      competitionName: 'Blah Blah',
      tournamentName: 'NBA',
      matchId: 'GSWvBos',
      marketName: 'Line',
    });

    result.sportType.should.eql('Basketball');
    result.competition.should.eql('NBA');
  });

  it('should find a promotion if promotions are within matches date range', () => {
    const matches = [
      {
        id: 'BADM1T4M10',
        name: 'FO TESTING MATCH - B1T4M10',
        spectrumUniqueId: 1372504,
        startTime: '2023-06-15T13:00:00.000Z',
        closeTime: '2023-06-15T13:00:00.000Z',
      },
      {
        id: 'BADM1T4M05',
        name: 'FO TESTING MATCH - B1T4M05',
        spectrumUniqueId: 1372499,
        startTime: '2023-06-15T13:00:00.000Z',
        closeTime: '2023-06-15T13:00:00.000Z',
      },
    ];
    const result = promotionFinder(promotions)({
      sportName: 'Basketball',
      matches,
    });
    should.exist(result);
  });

  it('should not find any promotion if promotions are not within matches date range', () => {
    const matches = [
      {
        id: 'BADM1T4M09',
        name: 'FO TESTING MATCH - B1T4M09',
        spectrumUniqueId: 1372503,
        startTime: '2022-06-15T13:00:00.000Z',
        closeTime: '2022-06-15T13:00:00.000Z',
      },
      {
        id: 'BADM1T4M01',
        name: 'FO TESTING MATCH - B1T4M01',
        spectrumUniqueId: 1372495,
        startTime: '2022-06-15T13:00:00.000Z',
        closeTime: '2022-06-15T13:00:00.000Z',
      },
    ];
    const result = promotionFinder(promotions)({
      sportName: 'Basketball',
      matches,
    });
    should.not.exist(result);
  });

  it('Should not find a promotion for tournament if toggled-off', () => {
    config.getDynamicConfig.returns({
      ...dynamicConfig,
      toggles: {
        showTournamentPromo: false,
      },
    });

    const result = promotionFinder(promotions)({
      sportName: 'Basketball',
      competitionName: 'Blah Blah',
      tournamentName: 'NBA',
      matchId: 'GSWvBos',
      marketName: 'Line',
    });

    should.not.exist(result);
  });
});
