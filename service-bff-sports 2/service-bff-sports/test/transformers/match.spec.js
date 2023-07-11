const should = require('should');
const sinon = require('sinon');

const { matchMapper } = require(`${global.SRC}/transformers`);
const infoMatchBaseball = require('../mocks/info-wift/matches/hanshin-v-chunichi.json');
const infoMatchATP = require('../mocks/info-wift/matches/kecmanovic-v-basilashvili.json');
const infoMatchOtherBetTypes = require('../mocks/info-wift/matches/next-federal-election-otherbettypes.json');
const infoMatchWithVisionPreview = require('../mocks/info-wift/matches/sydney-v-brisbane-preview-vision.json');
const infoMatchWithPreview = require('../mocks/info-wift/matches/sydney-v-brisbane-preview.json');
const infoMatchWithVision = require('../mocks/info-wift/matches/sydney-v-brisbane-vision.json');
const infoMatchWithNoVisionPreview = require('../mocks/info-wift/matches/sydney-v-brisbane.json');

const config = require(`${global.SRC}/config`);

const assertBaseballMatch = (response) => {
  response.should.eql({
    type: 'sports.propositions.horizontal',
    title: 'Hanshin v Chunichi',
    subTitle: 'Japanese Baseball League',
    matchId: 'HnshvChnc1',
    betOption: 'Head To Head',
    inPlay: false,
    goingInPlay: true,
    startTime: '2022-04-28T09:00:00.000Z',
    displayTime: '2022-04-28T09:00:00.000Z',
    hasVision: true,
    cashOutEligibility: 'PreMatch',
    promoAvailable: false,
    marketsCount: 30,
    shortName: 'JBL Hnsh-Chnc Hd to Hd',
    message: 'Bets stand regardless of pitcher',
    allowMulti: true,
    icon: { appIconIdentifier: 'baseball', imageURL: '', keepOriginalColor: false },
    onlineBetting: true,
    phoneBettingOnly: false,
    propositions: [
      {
        id: '764342', numberId: 764342, number: 764342, name: 'Hanshin', position: 'HOME', sortOrder: 1, returnWin: 2, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false, icon: { imageURL: 'https://metadata.beta.tab.com.au/icons/JBL/Hanshin%20Tigers.svg' },
      }, {
        id: '764345', numberId: 764345, number: 764345, name: 'Chunichi', position: 'AWAY', sortOrder: 2, returnWin: 1.8, returnPlace: 0, bettingStatus: 'Open', isOpen: true, allowPlace: false, icon: { imageURL: 'https://metadata.beta.tab.com.au/icons/JBL/Chunichi%20Dragons.svg' },
      }],
    navigation: { template: 'screen:sport:match', discoveryKey: 'bff:sports:match:page', params: { sportName: 'Baseball', competitionName: 'Japanese Baseball League', matchName: 'Hanshin v Chunichi' } },
  });
};
const assertATPMatch = (response) => {
  response.title.should.eql('Kecmanovic v Basilashvili');
  response.subTitle.should.eql('ATP Munich');
};

describe('Transformer - Match', () => {
  describe('matchMapper', () => {
    const { dynamicConfig } = config.get();

    beforeEach(() => {
      sinon.stub(config, 'getDynamicConfig');

      config.getDynamicConfig.returns({
        ...dynamicConfig,
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    it('Should return formatted match', () => {
      const params = {
        sportName: 'Baseball',
        competitionName: 'Japanese Baseball League',
      };
      const displayBetTypes = ['head to head'];
      const toMatchData = matchMapper({ displayBetTypes })(params);
      const response = toMatchData(infoMatchBaseball);
      response.type.should.eql('sports.propositions.horizontal');
      assertBaseballMatch(JSON.parse(JSON.stringify(response)));
    });

    it('Should return title and subTitle fields', () => {
      const params = {
        sportName: 'Tennis',
        competitionName: 'ATP',
        tournamentName: 'ATP Munich',
      };
      const toMatchData = matchMapper({})(params);
      const response = toMatchData(infoMatchATP);
      assertATPMatch(response);
    });

    it('Should return market closeTime as displayTime', () => {
      const params = {
        sportName: 'Tennis',
        competitionName: 'ATP',
        tournamentName: 'ATP Munich',
      };
      const displayBetTypes = ['head to head'];
      const toMatchData = matchMapper({ displayBetTypes })(params);
      const response = toMatchData(infoMatchATP);
      response.displayTime.should.eql('2022-04-29T09:00:00.000Z');
    });

    describe('Vision', () => {
      it('Should set hasVision to true if preview is present and vision is unavailable', () => {
        const params = {
          sportName: 'AFL Football',
          competitionName: 'AFL',
        };
        const toMatchData = matchMapper({})(params);
        const response = toMatchData(infoMatchWithPreview);
        response.hasVision.should.eql(true);
      });

      it('Should set hasVision to true if preview is unavailable but vision is present', () => {
        const params = {
          sportName: 'AFL Football',
          competitionName: 'AFL',
        };
        const toMatchData = matchMapper({})(params);
        const response = toMatchData(infoMatchWithVision);
        response.hasVision.should.eql(true);
      });

      it('Should set hasVision to true if both preview and vision is present', () => {
        const params = {
          sportName: 'AFL Football',
          competitionName: 'AFL',
        };
        const toMatchData = matchMapper({})(params);
        const response = toMatchData(infoMatchWithVisionPreview);
        response.hasVision.should.eql(true);
      });

      it('Should set hasVision to false if neither preview nor vision are present', () => {
        const params = {
          sportName: 'AFL Football',
          competitionName: 'AFL',
        };
        const toMatchData = matchMapper({})(params);
        const response = toMatchData(infoMatchWithNoVisionPreview);
        response.hasVision.should.eql(false);
      });

      it('Should set hasVision to false if hideVisionPreview is toggled on', () => {
        config.getDynamicConfig.returns({
          ...dynamicConfig,
          toggles: {
            hideVisionPreview: true,
          },
        });
        const params = {
          sportName: 'AFL Football',
          competitionName: 'AFL',
        };
        const toMatchData = matchMapper({})(params);
        const response = toMatchData(infoMatchWithPreview);
        response.hasVision.should.eql(false);
      });

      it('Should set hasVision to false if specific provider is toggled off', () => {
        config.getDynamicConfig.returns({
          ...dynamicConfig,
          hideVisionProviders: ['perform'],
        });
        const params = {
          sportName: 'AFL Football',
          competitionName: 'AFL',
        };
        const toMatchData = matchMapper({})(params);
        const response = toMatchData(infoMatchWithVision);
        response.hasVision.should.eql(false);
      });

      it('Should set hasVision to false if provider is off and hidePreviews is on', () => {
        config.getDynamicConfig.returns({
          ...dynamicConfig,
          toggles: {
            hideVisionPreview: true,
          },
          hideVisionProviders: ['perform'],
        });
        const params = {
          sportName: 'AFL Football',
          competitionName: 'AFL',
        };
        const toMatchData = matchMapper({})(params);
        const response = toMatchData(infoMatchWithVisionPreview);
        response.hasVision.should.eql(false);
      });
    });

    describe('Bet-type toggles', () => {
      it('Should show no markets if BetTypes toggle is empty ([])', () => {
        const displayBetTypes = [];
        const params = {
          sportName: 'Politics',
          competitionName: 'Australian Federal Politics',
        };
        const toMatchData = matchMapper({ displayBetTypes })(params);
        const response = toMatchData(infoMatchOtherBetTypes);
        should.not.exist(response.betOption);
        response.type.should.eql('sports.propositions.empty');
      });
      it('Should show first market if BetTypes toggle is set to "ALL"', () => {
        const displayBetTypes = ['all'];
        const params = {
          sportName: 'Politics',
          competitionName: 'Australian Federal Politics',
        };
        const toMatchData = matchMapper({ displayBetTypes })(params);
        const response = toMatchData(infoMatchOtherBetTypes);
        response.betOption.should.eql('Type of Government');
        response.type.should.eql('sports.propositions.vertical');
      });
      it('Should show first matching market if BetTypes toggle is set to specific market(s)', () => {
        const displayBetTypes = ['line', 'margin'];
        const params = {
          sportName: 'AFL Football',
          competitionName: 'AFL',
        };
        const toMatchData = matchMapper({ displayBetTypes })(params);
        const response = toMatchData(infoMatchWithNoVisionPreview);
        response.betOption.should.eql('Line');
        response.type.should.eql('sports.propositions.vertical');
      });
    });
  });
});
