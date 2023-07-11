const sinon = require('sinon');

const config = require(`${global.SRC}/config`);
const requestCache = require(`${global.SRC}/request-cache`);
const request = require(`${global.SRC}/request`);

describe('Request-cache', () => {
  const { infoService, recommendationService } = config.get();

  let clock;
  let stub;

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    stub = sinon.stub(request, 'getDefault');
  });

  [
    {
      title: 'fetchInfo',
      fn: requestCache.fetchInfo,
      service: infoService.url,
      key: 'info:key',
      url: 'info.url',
      params: { test: 'params' },
      expiry: 30000,
      res: { info: 'response', exp: 20000 },
    },
    {
      title: 'fetchRecommendation',
      fn: requestCache.fetchRecommendation,
      service: recommendationService.url,
      key: 'rec:key',
      url: 'rec.url',
      params: { test: 'params' },
      expiry: 30000,
      res: { rec: 'response', exp: 10000 },
    },
  ].forEach(({
    title,
    fn,
    service,
    key,
    url,
    params,
    expiry,
    res,
  }) => {
    describe(title, () => {
      beforeEach(() => {
        request.getDefault.withArgs(service).resolves({ _links: { [key]: url } });
        request.getDefault.withArgs(url).resolves(res);
      });

      it('initially calls request.get to get url and response', async () => {
        const response = await fn(key, params, () => expiry);

        sinon.assert.calledTwice(stub);
        sinon.assert.calledWithExactly(stub, service, {});
        sinon.assert.calledWithExactly(stub, url, params);

        response.should.eql(res);
      });

      it('then returns url and response from cache', async () => {
        const response = await fn(key, params, () => expiry);

        sinon.assert.notCalled(stub);

        response.should.eql(res);
      });

      it('uses cached service url but calls request.get if url params are different', async () => {
        const newParams = { new: 'params' };

        const response = await fn(key, newParams, () => expiry);

        sinon.assert.calledOnceWithExactly(stub, url, newParams);

        response.should.eql(res);
      });

      it('calls request.get to get response after response cache expires', async () => {
        clock.tick(expiry);

        const response = await fn(key, params, () => expiry);

        sinon.assert.calledOnceWithExactly(stub, url, params);

        response.should.eql(res);
      });

      it('calls request.get to get url and response after both caches expire', async () => {
        clock.tick(3600000);

        const response = await fn(key, params, () => expiry);

        sinon.assert.calledTwice(stub);
        sinon.assert.calledWithExactly(stub, service, {});
        sinon.assert.calledWithExactly(stub, url, params);

        response.should.eql(res);
      });

      it('can set expiry based on response', async () => {
        const expFn = (r) => r.exp;

        const newParams = { test: 'expiry' };

        const response1 = await fn(key, newParams, expFn);

        sinon.assert.calledOnceWithExactly(stub, url, newParams);

        response1.should.eql(res);

        clock.tick(res.exp - 1);

        const response2 = await fn(key, newParams);

        sinon.assert.calledOnce(stub);

        response2.should.eql(res);

        clock.tick(res.exp);

        const response3 = await fn(key, newParams, expFn);

        sinon.assert.calledTwice(stub);
        sinon.assert.calledWithExactly(stub, url, newParams);

        response3.should.eql(res);
      });
    });
  });
});
