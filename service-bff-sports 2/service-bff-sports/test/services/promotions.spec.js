const should = require('should');
const sinon = require('sinon');

const promoVisibility = require('../mocks/aem/sport.promo.visbility.json');
const matchesMock = require('../mocks/info-wift/competitions/ncaa-basketball.json');

const requestCache = require(`${global.SRC}/request-cache`);
const promotionsService = require(`${global.SRC}/services/promotions`);

describe('Service - Promotions', () => {
  beforeEach(() => {
    sinon.stub(requestCache, 'fetchAem');
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('fetchPromotions', () => {
    beforeEach(() => {
      requestCache.fetchAem.withArgs('promo').resolves(promoVisibility);
    });

    describe('Returns Promotion', () => {
      beforeEach(() => {
        sinon.useFakeTimers(Date.parse('2022-09-09T00:00:00.000Z'));
      });
      it('Should return promotion if available', async () => {
        const params = {
          jurisdiction: 'QLD',
        };
        const promotions = await promotionsService.fetchPromotions(params);
        promotions.should.eql([{
          authenticationStatus: 'logged-in,logged-out',
          jurisdiction: 'nsw,qld',
          bannerImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/backgrounds/3655_PromoVis_Owned_1440x168_Basketball.jpeg',
          learnMoreImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg',
          startDate: '2022-02-20',
          endDate: '2022-11-30',
          sportType: 'Basketball',
          competition: 'NCAA Basketball',
          marketType: 'Head to Head',
          promoTitle: 'NBA Promo',
          betNowText: 'Bet Now',
          promoDetails: 'NBA - September 4+ Legs, 1 Fails',
          learnMoreTitle: 'NBA - 29 July MLB H2H Multi Offer',
          learnMoreDetails: "Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,../;']]\\=-`1adsfasdfaasTips:<h3>What are legal terms?</h3>Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.",
          termsAndCondition: "<br>Tips:<h3>What are legal terms?</h3>Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.<b> Does Termly's legal terms generator cover all contract and consumer protection laws?</b><br>Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br><br><br>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.&nbsp;Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.",
        }]);
      });
    });

    describe('Validates Jurisdiction', () => {
      beforeEach(() => {
        sinon.useFakeTimers(Date.parse('2022-09-09T00:00:00.000Z'));
      });
      it('Should handle promotions based on jurisdiction', async () => {
        const params = {
          jurisdiction: 'WA',
        };
        const promotions = await promotionsService.fetchPromotions(params);
        promotions.should.eql([]);
      });
    });

    describe('Validates Future Dates', () => {
      beforeEach(() => {
        sinon.useFakeTimers(Date.parse('2022-01-01T00:00:00.000Z'));
      });
      it('Should check & show Future promotions', async () => {
        const params = {
          jurisdiction: 'QLD',
        };
        const promotions = await promotionsService.fetchPromotions(params);
        promotions.should.eql([
          {
            authenticationStatus: 'logged-in,logged-out',
            jurisdiction: 'nsw,qld',
            bannerImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/backgrounds/3655_PromoVis_Owned_1440x168_Basketball.jpeg',
            learnMoreImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg',
            startDate: '2022-02-20',
            endDate: '2022-11-30',
            sportType: 'Basketball',
            competition: 'NCAA Basketball',
            marketType: 'Head to Head',
            promoTitle: 'NBA Promo',
            betNowText: 'Bet Now',
            promoDetails: 'NBA - September 4+ Legs, 1 Fails',
            learnMoreTitle: 'NBA - 29 July MLB H2H Multi Offer',
            learnMoreDetails: 'Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,../;\']]\\=-`1adsfasdfaasTips:<h3>What are legal terms?</h3>Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.',
            termsAndCondition: '<br>Tips:<h3>What are legal terms?</h3>Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.<b> Does Termly\'s legal terms generator cover all contract and consumer protection laws?</b><br>Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br><br><br>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.&nbsp;Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.',
          },
        ]);
      });
    });

    describe('Handle logged-in/out states', () => {
      beforeEach(() => {
        sinon.useFakeTimers(Date.parse('2022-09-09T00:00:00.000Z'));
      });
      it('Should return specific logged-in promo version', async () => {
        const params = {
          jurisdiction: 'NT',
          loggedIn: 'true',
        };
        const promotions = await promotionsService.fetchPromotions(params);
        promotions.should.eql([{
          authenticationStatus: 'logged-in',
          jurisdiction: 'nt,sa',
          bannerImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/backgrounds/3655_PromoVis_Owned_1440x168_Basketball.jpeg',
          learnMoreImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg',
          startDate: '2022-02-20',
          endDate: '2022-10-30',
          sportType: 'Basketball',
          competition: 'NCAA Basketball',
          marketType: 'Head to Head',
          promoTitle: 'NBA Promo',
          betNowText: 'Bet Now',
          promoDetails: 'Logged In only',
          learnMoreTitle: 'NBA - 29 July MLB H2H Multi Offer',
          learnMoreDetails: "Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,../;']]\\=-`1adsfasdfaasTips:<h3>What are legal terms?</h3>Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.",
          termsAndCondition: "<br>Tips:<h3>What are legal terms?</h3>Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.<b> Does Termly's legal terms generator cover all contract and consumer protection laws?</b><br>Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br><br><br>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.&nbsp;Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.",
        }]);
      });
      it('Should not return logged-in promo when user is logged-out', async () => {
        const params = {
          jurisdiction: 'NT',
          loggedIn: 'false',
        };
        const promotions = await promotionsService.fetchPromotions(params);
        promotions.should.eql([]);
      });
    });
  });

  describe('getPromoBanner', () => {
    beforeEach(() => {
      sinon.useFakeTimers(Date.parse('2022-09-09T00:00:00.000Z'));
      requestCache.fetchAem.withArgs('promo').resolves(promoVisibility);
    });

    it('Should return competition level promotions', async () => {
      const params = {
        jurisdiction: 'NSW',
        sportName: 'Basketball',
        competitionName: 'NCAA Basketball',
      };
      const banner = await promotionsService.getPromoBanner(params);
      banner.type.should.eql('sports.competition.promo');
      banner.timer.should.eql(2);
      banner.data.should.eql([
        {
          icon: {
            appIconIdentifier: 'app_promo_offers',
            imageURL: '',
            keepOriginalColor: true,
          },
          promoText: '4+ Legs, 1 Fails',
          promoDetails: "<!DOCTYPE html><html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><script type=\"text/javascript\">function invokeNative(){if (MessageInvoker && typeof MessageInvoker.postMessage === 'function'){MessageInvoker.postMessage('Bet now');}}</script><style>html{box-sizing:border-box;font-family:'Inter',sans-serif;font-size:16px;font-style:normal;}*,*:before,*:after{box-sizing:inherit;}body{display:flex;flex-direction:column;margin:0;min-height:100vh;}img{display:block;height:auto;max-width:100%;}.content{color:rgba(51,51,51,0.69);flex:1;font-weight:400;margin:2rem 1rem 1rem 1rem;}.footer{background:#ffffff;bottom:0;padding:1.5rem 1rem 1rem 1rem;position:sticky;width:100%;}.learn-more{margin-bottom:3.75rem;text-align:center;}.terms{font-size:0.75rem;line-height:1rem;}.bet-now{background:#008542;border:none;border-radius:6px;color:#ffffff;font-size:1rem;font-weight:600;line-height:1.25rem;padding:0.75rem 1rem;width:100%;}.learn-more-title{color:#191919;font-size:1.25rem;font-weight:600;line-height:1.5rem;margin-bottom:1rem;}.learn-more-details{font-size:1rem;line-height:1.25rem;}.terms-title{font-weight:600;margin-bottom:0.5rem;}</style></head><body><img src=\"https:&#x2F;&#x2F;congo.cmsapi.tab.com.au&#x2F;content&#x2F;dam&#x2F;tab-digital&#x2F;job-number---campaign-name&#x2F;owned&#x2F;promo-visibility&#x2F;8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg\" /><div class=\"content\"><div class=\"learn-more\"><div class=\"learn-more-title\">NFL Head to Head Offer</div><div class=\"learn-more-details\">Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,..&#x2F;;&#39;]]\\&#x3D;-&#x60;1adsfasdfaasTips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.</div></div><div class=\"terms\"><div class=\"terms-title\">Terms & Conditions</div><div>Tips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.&nbsp;&lt;b&gt;Does Termly&#39;s legal terms generator cover all contract and consumer protection laws?&lt;&#x2F;b&gt;<br/>&nbsp;Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br/><br/>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.</div></div></div><div class=\"footer\"><button type=\"button\" class=\"bet-now\" onclick=\"invokeNative()\">Bet Now</button></div></body></html>",
        },
        {
          icon: {
            appIconIdentifier: 'app_promo_offers',
            imageURL: '',
            keepOriginalColor: true,
          },
          promoText: 'NBA - September 4+ Legs, 1 Fails',
          promoDetails: "<!DOCTYPE html><html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><script type=\"text/javascript\">function invokeNative(){if (MessageInvoker && typeof MessageInvoker.postMessage === 'function'){MessageInvoker.postMessage('Bet now');}}</script><style>html{box-sizing:border-box;font-family:'Inter',sans-serif;font-size:16px;font-style:normal;}*,*:before,*:after{box-sizing:inherit;}body{display:flex;flex-direction:column;margin:0;min-height:100vh;}img{display:block;height:auto;max-width:100%;}.content{color:rgba(51,51,51,0.69);flex:1;font-weight:400;margin:2rem 1rem 1rem 1rem;}.footer{background:#ffffff;bottom:0;padding:1.5rem 1rem 1rem 1rem;position:sticky;width:100%;}.learn-more{margin-bottom:3.75rem;text-align:center;}.terms{font-size:0.75rem;line-height:1rem;}.bet-now{background:#008542;border:none;border-radius:6px;color:#ffffff;font-size:1rem;font-weight:600;line-height:1.25rem;padding:0.75rem 1rem;width:100%;}.learn-more-title{color:#191919;font-size:1.25rem;font-weight:600;line-height:1.5rem;margin-bottom:1rem;}.learn-more-details{font-size:1rem;line-height:1.25rem;}.terms-title{font-weight:600;margin-bottom:0.5rem;}</style></head><body><img src=\"https:&#x2F;&#x2F;congo.cmsapi.tab.com.au&#x2F;content&#x2F;dam&#x2F;tab-digital&#x2F;job-number---campaign-name&#x2F;owned&#x2F;promo-visibility&#x2F;8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg\" /><div class=\"content\"><div class=\"learn-more\"><div class=\"learn-more-title\">NBA - 29 July MLB H2H Multi Offer</div><div class=\"learn-more-details\">Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,..&#x2F;;&#39;]]\\&#x3D;-&#x60;1adsfasdfaasTips:&lt;h3&gt;What are legal terms?&lt;&#x2F;h3&gt;Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.</div></div><div class=\"terms\"><div class=\"terms-title\">Terms & Conditions</div><div><br/>Tips:&lt;h3&gt;What are legal terms?&lt;&#x2F;h3&gt;Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.&lt;b&gt; Does Termly&#39;s legal terms generator cover all contract and consumer protection laws?&lt;&#x2F;b&gt;<br/>Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br/><br/><br/>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.&nbsp;Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.</div></div></div><div class=\"footer\"><button type=\"button\" class=\"bet-now\" onclick=\"invokeNative()\">Bet Now</button></div></body></html>",
        },
      ]);
    });

    it('Should NOT return promotion if not available', async () => {
      const params = {
        jurisdiction: 'QLD',
        sportName: 'Tennis',
        competitionName: 'Mens Singles',
      };
      const banner = await promotionsService.getPromoBanner(params);
      should.not.exist(banner);
    });

    it('Should return match specific promotions if available', async () => {
      const params = {
        jurisdiction: 'SA',
        sportName: 'Basketball',
        competitionName: 'NCAA Basketball',
        matchId: 'GSWvBos',
      };
      const banner = await promotionsService.getPromoBanner(params);
      banner.type.should.eql('sports.match.promo');
      banner.timer.should.eql(2);
      banner.data.should.eql([
        {
          icon: {
            appIconIdentifier: 'app_promo_offers',
            imageURL: '',
            keepOriginalColor: true,
          },
          promoText: '4+ Legs, 1 Fails',
          promoDetails: "<!DOCTYPE html><html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><script type=\"text/javascript\">function invokeNative(){if (MessageInvoker && typeof MessageInvoker.postMessage === 'function'){MessageInvoker.postMessage('Bet now');}}</script><style>html{box-sizing:border-box;font-family:'Inter',sans-serif;font-size:16px;font-style:normal;}*,*:before,*:after{box-sizing:inherit;}body{display:flex;flex-direction:column;margin:0;min-height:100vh;}img{display:block;height:auto;max-width:100%;}.content{color:rgba(51,51,51,0.69);flex:1;font-weight:400;margin:2rem 1rem 1rem 1rem;}.footer{background:#ffffff;bottom:0;padding:1.5rem 1rem 1rem 1rem;position:sticky;width:100%;}.learn-more{margin-bottom:3.75rem;text-align:center;}.terms{font-size:0.75rem;line-height:1rem;}.bet-now{background:#008542;border:none;border-radius:6px;color:#ffffff;font-size:1rem;font-weight:600;line-height:1.25rem;padding:0.75rem 1rem;width:100%;}.learn-more-title{color:#191919;font-size:1.25rem;font-weight:600;line-height:1.5rem;margin-bottom:1rem;}.learn-more-details{font-size:1rem;line-height:1.25rem;}.terms-title{font-weight:600;margin-bottom:0.5rem;}</style></head><body><img src=\"https:&#x2F;&#x2F;congo.cmsapi.tab.com.au&#x2F;content&#x2F;dam&#x2F;tab-digital&#x2F;job-number---campaign-name&#x2F;owned&#x2F;promo-visibility&#x2F;8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg\" /><div class=\"content\"><div class=\"learn-more\"><div class=\"learn-more-title\">NFL Head to Head Offer</div><div class=\"learn-more-details\">Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,..&#x2F;;&#39;]]\\&#x3D;-&#x60;1adsfasdfaasTips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.</div></div><div class=\"terms\"><div class=\"terms-title\">Terms & Conditions</div><div>Tips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.&nbsp;&lt;b&gt;Does Termly&#39;s legal terms generator cover all contract and consumer protection laws?&lt;&#x2F;b&gt;<br/>&nbsp;Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br/><br/>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.</div></div></div><div class=\"footer\"><button type=\"button\" class=\"bet-now\" onclick=\"invokeNative()\">Bet Now</button></div></body></html>",
        },
        {
          icon: {
            appIconIdentifier: 'app_promo_offers',
            imageURL: '',
            keepOriginalColor: true,
          },
          promoText: 'Special 4+ Legs, 1 Fails',
          promoDetails: "<!DOCTYPE html><html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><script type=\"text/javascript\">function invokeNative(){if (MessageInvoker && typeof MessageInvoker.postMessage === 'function'){MessageInvoker.postMessage('Bet now');}}</script><style>html{box-sizing:border-box;font-family:'Inter',sans-serif;font-size:16px;font-style:normal;}*,*:before,*:after{box-sizing:inherit;}body{display:flex;flex-direction:column;margin:0;min-height:100vh;}img{display:block;height:auto;max-width:100%;}.content{color:rgba(51,51,51,0.69);flex:1;font-weight:400;margin:2rem 1rem 1rem 1rem;}.footer{background:#ffffff;bottom:0;padding:1.5rem 1rem 1rem 1rem;position:sticky;width:100%;}.learn-more{margin-bottom:3.75rem;text-align:center;}.terms{font-size:0.75rem;line-height:1rem;}.bet-now{background:#008542;border:none;border-radius:6px;color:#ffffff;font-size:1rem;font-weight:600;line-height:1.25rem;padding:0.75rem 1rem;width:100%;}.learn-more-title{color:#191919;font-size:1.25rem;font-weight:600;line-height:1.5rem;margin-bottom:1rem;}.learn-more-details{font-size:1rem;line-height:1.25rem;}.terms-title{font-weight:600;margin-bottom:0.5rem;}</style></head><body><img src=\"https:&#x2F;&#x2F;congo.cmsapi.tab.com.au&#x2F;content&#x2F;dam&#x2F;tab-digital&#x2F;job-number---campaign-name&#x2F;owned&#x2F;promo-visibility&#x2F;8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg\" /><div class=\"content\"><div class=\"learn-more\"><div class=\"learn-more-title\">Special NFL Head to Head Offer</div><div class=\"learn-more-details\">Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,..&#x2F;;&#39;]]\\&#x3D;-&#x60;1adsfasdfaasTips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.</div></div><div class=\"terms\"><div class=\"terms-title\">Terms & Conditions</div><div>Tips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.&nbsp;&lt;b&gt;Does Termly&#39;s legal terms generator cover all contract and consumer protection laws?&lt;&#x2F;b&gt;<br/>&nbsp;Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br/><br/>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.</div></div></div><div class=\"footer\"><button type=\"button\" class=\"bet-now\" onclick=\"invokeNative()\">Bet Now</button></div></body></html>",
        },
      ]);
    });
  });

  describe('getEligiblePromotions', () => {
    const matches = matchesMock.matches.map((match) => ({ ...match, matchId: match.id }));
    it('Should return competition level promotions having matches start time within promo dates', () => {
      const params = {
        jurisdiction: 'NSW',
        sportName: 'Basketball',
        competitionName: 'NCAA Basketball',
      };
      const promotions = [
        {
          authenticationStatus: 'logged-in,logged-out',
          jurisdiction: 'vic,nsw',
          bannerImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/backgrounds/3655_PromoVis_Owned_1440x168_NFL.jpeg',
          learnMoreImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg',
          inVenueOnly: 'False',
          startDate: '2022-02-20',
          endDate: '2022-11-30',
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
      ];
      const banner = promotionsService.getEligiblePromotions(
        promotions,
        matches,
        params,
      );
      banner.type.should.eql('sports.competition.promo');
      banner.timer.should.eql(2);
      banner.data.should.eql([
        {
          icon: {
            appIconIdentifier: 'app_promo_offers',
            imageURL: '',
            keepOriginalColor: true,
          },
          promoText: '4+ Legs, 1 Fails',
          promoDetails: "<!DOCTYPE html><html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><script type=\"text/javascript\">function invokeNative(){if (MessageInvoker && typeof MessageInvoker.postMessage === 'function'){MessageInvoker.postMessage('Bet now');}}</script><style>html{box-sizing:border-box;font-family:'Inter',sans-serif;font-size:16px;font-style:normal;}*,*:before,*:after{box-sizing:inherit;}body{display:flex;flex-direction:column;margin:0;min-height:100vh;}img{display:block;height:auto;max-width:100%;}.content{color:rgba(51,51,51,0.69);flex:1;font-weight:400;margin:2rem 1rem 1rem 1rem;}.footer{background:#ffffff;bottom:0;padding:1.5rem 1rem 1rem 1rem;position:sticky;width:100%;}.learn-more{margin-bottom:3.75rem;text-align:center;}.terms{font-size:0.75rem;line-height:1rem;}.bet-now{background:#008542;border:none;border-radius:6px;color:#ffffff;font-size:1rem;font-weight:600;line-height:1.25rem;padding:0.75rem 1rem;width:100%;}.learn-more-title{color:#191919;font-size:1.25rem;font-weight:600;line-height:1.5rem;margin-bottom:1rem;}.learn-more-details{font-size:1rem;line-height:1.25rem;}.terms-title{font-weight:600;margin-bottom:0.5rem;}</style></head><body><img src=\"https:&#x2F;&#x2F;congo.cmsapi.tab.com.au&#x2F;content&#x2F;dam&#x2F;tab-digital&#x2F;job-number---campaign-name&#x2F;owned&#x2F;promo-visibility&#x2F;8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg\" /><div class=\"content\"><div class=\"learn-more\"><div class=\"learn-more-title\">NFL Head to Head Offer</div><div class=\"learn-more-details\">Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,..&#x2F;;&#39;]]\\&#x3D;-&#x60;1adsfasdfaasTips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.</div></div><div class=\"terms\"><div class=\"terms-title\">Terms & Conditions</div><div>Tips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.&nbsp;&lt;b&gt;Does Termly&#39;s legal terms generator cover all contract and consumer protection laws?&lt;&#x2F;b&gt;<br/>&nbsp;Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br/><br/>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.</div></div></div><div class=\"footer\"><button type=\"button\" class=\"bet-now\" onclick=\"invokeNative()\">Bet Now</button></div></body></html>",
          competitionName: 'NCAA Basketball',
        },
      ]);
    });

    it('Should NOT return promotion if matches start time is not falling within promo dates', () => {
      const params = {
        jurisdiction: 'NSW',
        sportName: 'Basketball',
        competitionName: 'NCAA Basketball',
      };
      const promotions = [
        {
          authenticationStatus: 'logged-in,logged-out',
          jurisdiction: 'vic,nsw',
          bannerImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/backgrounds/3655_PromoVis_Owned_1440x168_NFL.jpeg',
          learnMoreImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg',
          inVenueOnly: 'False',
          startDate: '2022-02-20',
          endDate: '2022-02-25',
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
      ];
      const banner = promotionsService.getEligiblePromotions(
        promotions,
        matches,
        params,
      );
      should.not.exist(banner);
    });

    it('Should return competition level promotions having matches start time within promo dates with new datetime keys', () => {
      const params = {
        jurisdiction: 'NSW',
        sportName: 'Basketball',
        competitionName: 'NCAA Basketball',
      };
      const promotions = [
        {
          authenticationStatus: 'logged-in,logged-out',
          jurisdiction: 'vic,nsw',
          bannerImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/backgrounds/3655_PromoVis_Owned_1440x168_NFL.jpeg',
          learnMoreImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg',
          inVenueOnly: 'False',
          matchStartOnOrAfter: '2022-02-20T02:00:00.000Z',
          matchStartOnOrBefore: '2022-11-30T02:00:00.000Z',
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
      ];
      const banner = promotionsService.getEligiblePromotions(
        promotions,
        matches,
        params,
      );
      banner.type.should.eql('sports.competition.promo');
      banner.timer.should.eql(2);
      banner.data.should.eql([
        {
          icon: {
            appIconIdentifier: 'app_promo_offers',
            imageURL: '',
            keepOriginalColor: true,
          },
          promoText: '4+ Legs, 1 Fails',
          promoDetails: "<!DOCTYPE html><html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><script type=\"text/javascript\">function invokeNative(){if (MessageInvoker && typeof MessageInvoker.postMessage === 'function'){MessageInvoker.postMessage('Bet now');}}</script><style>html{box-sizing:border-box;font-family:'Inter',sans-serif;font-size:16px;font-style:normal;}*,*:before,*:after{box-sizing:inherit;}body{display:flex;flex-direction:column;margin:0;min-height:100vh;}img{display:block;height:auto;max-width:100%;}.content{color:rgba(51,51,51,0.69);flex:1;font-weight:400;margin:2rem 1rem 1rem 1rem;}.footer{background:#ffffff;bottom:0;padding:1.5rem 1rem 1rem 1rem;position:sticky;width:100%;}.learn-more{margin-bottom:3.75rem;text-align:center;}.terms{font-size:0.75rem;line-height:1rem;}.bet-now{background:#008542;border:none;border-radius:6px;color:#ffffff;font-size:1rem;font-weight:600;line-height:1.25rem;padding:0.75rem 1rem;width:100%;}.learn-more-title{color:#191919;font-size:1.25rem;font-weight:600;line-height:1.5rem;margin-bottom:1rem;}.learn-more-details{font-size:1rem;line-height:1.25rem;}.terms-title{font-weight:600;margin-bottom:0.5rem;}</style></head><body><img src=\"https:&#x2F;&#x2F;congo.cmsapi.tab.com.au&#x2F;content&#x2F;dam&#x2F;tab-digital&#x2F;job-number---campaign-name&#x2F;owned&#x2F;promo-visibility&#x2F;8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg\" /><div class=\"content\"><div class=\"learn-more\"><div class=\"learn-more-title\">NFL Head to Head Offer</div><div class=\"learn-more-details\">Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,..&#x2F;;&#39;]]\\&#x3D;-&#x60;1adsfasdfaasTips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.</div></div><div class=\"terms\"><div class=\"terms-title\">Terms & Conditions</div><div>Tips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.&nbsp;&lt;b&gt;Does Termly&#39;s legal terms generator cover all contract and consumer protection laws?&lt;&#x2F;b&gt;<br/>&nbsp;Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br/><br/>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.</div></div></div><div class=\"footer\"><button type=\"button\" class=\"bet-now\" onclick=\"invokeNative()\">Bet Now</button></div></body></html>",
          competitionName: 'NCAA Basketball',
        },
      ]);
    });

    it('Should return competition level promotions having matchId even if match date do not fall within promo dates', () => {
      const params = {
        jurisdiction: 'NSW',
        sportName: 'Basketball',
        competitionName: 'NCAA Basketball',
      };
      const promotions = [
        {
          authenticationStatus: 'logged-in,logged-out',
          jurisdiction: 'vic,nsw',
          bannerImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/backgrounds/3655_PromoVis_Owned_1440x168_NFL.jpeg',
          learnMoreImage: 'https://congo.cmsapi.tab.com.au/content/dam/tab-digital/job-number---campaign-name/owned/promo-visibility/8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg',
          inVenueOnly: 'False',
          matchStartOnOrAfter: '2022-02-20T02:00:00.000Z',
          matchStartOnOrBefore: '2022-02-25T02:00:00.000Z',
          sportType: 'Basketball',
          competition: 'NCAA Basketball',
          marketType: 'Head to Head',
          matchIds: 'CSUNvCSBk',
          promoTitle: 'NCAA Basketball',
          betNowText: 'Bet Now',
          promoDetails: '4+ Legs, 1 Fails',
          learnMoreTitle: 'NFL Head to Head Offer',
          learnMoreDetails: "Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,../;']]\\=-`1adsfasdfaasTips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.",
          termsAndCondition: "Tips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.&nbsp;<b>Does Termly's legal terms generator cover all contract and consumer protection laws?</b><br>&nbsp;Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br><br>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.",
        },
      ];
      const banner = promotionsService.getEligiblePromotions(
        promotions,
        matches,
        params,
      );
      banner.type.should.eql('sports.competition.promo');
      banner.timer.should.eql(2);
      banner.data.should.eql([
        {
          icon: {
            appIconIdentifier: 'app_promo_offers',
            imageURL: '',
            keepOriginalColor: true,
          },
          promoText: '4+ Legs, 1 Fails',
          promoDetails: "<!DOCTYPE html><html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><script type=\"text/javascript\">function invokeNative(){if (MessageInvoker && typeof MessageInvoker.postMessage === 'function'){MessageInvoker.postMessage('Bet now');}}</script><style>html{box-sizing:border-box;font-family:'Inter',sans-serif;font-size:16px;font-style:normal;}*,*:before,*:after{box-sizing:inherit;}body{display:flex;flex-direction:column;margin:0;min-height:100vh;}img{display:block;height:auto;max-width:100%;}.content{color:rgba(51,51,51,0.69);flex:1;font-weight:400;margin:2rem 1rem 1rem 1rem;}.footer{background:#ffffff;bottom:0;padding:1.5rem 1rem 1rem 1rem;position:sticky;width:100%;}.learn-more{margin-bottom:3.75rem;text-align:center;}.terms{font-size:0.75rem;line-height:1rem;}.bet-now{background:#008542;border:none;border-radius:6px;color:#ffffff;font-size:1rem;font-weight:600;line-height:1.25rem;padding:0.75rem 1rem;width:100%;}.learn-more-title{color:#191919;font-size:1.25rem;font-weight:600;line-height:1.5rem;margin-bottom:1rem;}.learn-more-details{font-size:1rem;line-height:1.25rem;}.terms-title{font-weight:600;margin-bottom:0.5rem;}</style></head><body><img src=\"https:&#x2F;&#x2F;congo.cmsapi.tab.com.au&#x2F;content&#x2F;dam&#x2F;tab-digital&#x2F;job-number---campaign-name&#x2F;owned&#x2F;promo-visibility&#x2F;8358_AFL%2B2021_ATL%2BOffers_SGM_All%2BGames__Owned_PromoTile_462x218.jpeg\" /><div class=\"content\"><div class=\"learn-more\"><div class=\"learn-more-title\">NFL Head to Head Offer</div><div class=\"learn-more-details\">Bigchange (Manish)Learn More - This is the Thoroughbred,&nbsp; season 1,2,3,8,9sdfasdfsa~!@#$%^&amp;*()_+_}|:?&lt;&gt;,..&#x2F;;&#39;]]\\&#x3D;-&#x60;1adsfasdfaasTips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.</div></div><div class=\"terms\"><div class=\"terms-title\">Terms & Conditions</div><div>Tips:Legal terms are an agreement between you and your users. Legal terms establish the rights and responsibilities of both parties. Those rights and responsibilities include any rules that users must agree to when using your website or mobile app.&nbsp;&lt;b&gt;Does Termly&#39;s legal terms generator cover all contract and consumer protection laws?&lt;&#x2F;b&gt;<br/>&nbsp;Termly’s legal terms generator is designed to help you comply with contract laws. While our legal terms generator may help you comply with other similarly drafted laws, it is not specifically written to comply with the laws of any other country. We recommend consulting with a local attorney for any country not yet specifically included in our current offerings.<br/><br/>1. *Excludes WA &amp; SA residents.2. Available online to TAB Account holders only. Promo T&amp;Cs apply.3. Min $1.10 odds per leg. Combined Multi of $1.50.4. Available once per person on first qualifying Multi placed online on each of Rounds 1 to 4.5. Bonus Bet is equal to stake up to $50. No Futures, bonus, cash out, partial cash out or live bets qualify.Help is close at hand. Call Gambler’s Help, GambleAware or the ACT Gambling Counselling &amp; Support Service on 1800 858 858 www.gambleaware.nsw.gov.au or www.gamblinghelponline.org.au. Don’t let the game play you. Stay in control. Gamble Responsibly.</div></div></div><div class=\"footer\"><button type=\"button\" class=\"bet-now\" onclick=\"invokeNative()\">Bet Now</button></div></body></html>",
          competitionName: 'NCAA Basketball',
        },
      ]);
    });
  });
});
