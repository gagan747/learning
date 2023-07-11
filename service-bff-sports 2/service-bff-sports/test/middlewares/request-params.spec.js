const { formatRequestParams } = require(`${global.SRC}/middlewares/request-params`);

describe('Middleware: Request Params', () => {
  const res = {};
  const next = () => { };
  let req = {};

  it('Should update Jurisdiction parameter to be Uppercase', () => {
    req = {
      query: { jurisdiction: 'nsw' },
    };
    formatRequestParams(req, res, next);
    req.query.jurisdiction.should.eql('NSW');
  });

  it('Should update Platform parameter to be Lowercase', () => {
    req = {
      query: { platform: 'Mobile' },
    };
    formatRequestParams(req, res, next);
    req.query.platform.should.eql('mobile');
  });

  it('Should update OS parameter to be Lowercase', () => {
    req = {
      query: { os: 'iOS' },
    };
    formatRequestParams(req, res, next);
    req.query.os.should.eql('ios');
  });
});
