const should = require('should');
const sinon = require('sinon');
const request = require('supertest');

const { createServer } = require(`${global.SRC}/server`);
const config = require(`${global.SRC}/config`);
const homeController = require(`${global.SRC}/controllers/home`);

describe('Server', () => {
  describe('Middleware: Request Params', () => {
    let query;
    let server;
    before(() => {
      sinon.stub(homeController, 'upcoming').callsFake((req, res, next) => {
        query = req.query;
        res.json({});
        return next();
      });
      server = createServer();
    });
    after(() => {
      sinon.restore();
    });

    it('Should pass updated query params to Handler from Request Middleware', async () => {
      const qs = 'jurisdiction=nsw&platform=MObile&os=iOS&version=1.0.0';
      await request(server).get(`/v1/bff-sports/upcoming?${qs}`);
      query.jurisdiction.should.eql('NSW');
      query.os.should.eql('ios');
      query.platform.should.eql('mobile');
    });
  });

  describe('Middleware: Response Headers', () => {
    let server;
    let response;
    const cfg = config.get();
    beforeEach(() => {
      sinon.stub(homeController, 'page').callsFake((req, res, next) => {
        res.json({});
        response = res;
        return next();
      });
      server = createServer();
    });
    afterEach(() => {
      sinon.restore();
    });

    it('Should add cache & expires headers to response', async () => {
      sinon.useFakeTimers(Date.parse('2022-06-23T09:35:00.000Z'));

      const qs = 'jurisdiction=nsw&platform=MObile&os=iOS&version=1.0.0';
      await request(server).get(`/v1/bff-sports/home?${qs}`);
      response.header('expires').should.eql('Thu, 23 Jun 2022 09:38:00 GMT');
      response.header('cache-control').should.eql('public, max-age=180');
    });

    it('Should not add expires headers to response if toggled off', async () => {
      sinon.stub(config, 'getDynamicConfig');
      config.getDynamicConfig.returns({
        ...cfg.dynamicConfig,
        toggles: {
          enableExpiresHeader: false,
        },
      });

      const qs = 'jurisdiction=nsw&platform=MObile&os=iOS&version=1.0.0';
      await request(server).get(`/v1/bff-sports/home?${qs}`);
      should.not.exist(response.header('expires'));
      response.header('cache-control').should.eql('public, max-age=0');
    });

    it('Should handle toggles correctly with in-between changes', async () => {
      sinon.useFakeTimers(Date.parse('2022-06-23T09:35:00.000Z'));
      const qs = 'jurisdiction=nsw&platform=MObile&os=iOS&version=1.0.0';
      await request(server).get(`/v1/bff-sports/home?${qs}`);
      response.header('expires').should.eql('Thu, 23 Jun 2022 09:38:00 GMT');
      response.header('cache-control').should.eql('public, max-age=180');

      sinon.stub(config, 'getDynamicConfig');
      config.getDynamicConfig.returns({
        ...cfg.dynamicConfig,
        toggles: {
          enableExpiresHeader: false,
        },
      });

      await request(server).get(`/v1/bff-sports/home?${qs}`);
      should.not.exist(response.header('expires'));
      response.header('cache-control').should.eql('public, max-age=0');

      config.getDynamicConfig.returns({
        ...cfg.dynamicConfig,
        toggles: {
          enableExpiresHeader: true,
        },
        expiresHeader: {
          ...cfg.dynamicConfig.expiresHeader,
          routeOverrides: {
            'bff:sports:home': '400s',
          },
        },
      });

      await request(server).get(`/v1/bff-sports/home?${qs}`);
      response.header('expires').should.eql('Thu, 23 Jun 2022 09:41:40 GMT');
      response.header('cache-control').should.eql('public, max-age=400');
    });
  });
});
