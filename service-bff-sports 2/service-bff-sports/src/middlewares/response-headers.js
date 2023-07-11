const config = require('../config');
const { seconds } = require('../utils');

const enhanceReponseHeaders = (req, res, next) => {
  const {
    toggles: { enableExpiresHeader },
    expiresHeader: { routeOverrides, defaultMaxAge },
  } = config.getDynamicConfig();

  if (enableExpiresHeader) {
    let cacheSeconds = seconds(defaultMaxAge);
    if (routeOverrides[req.route.name]) {
      cacheSeconds = seconds(routeOverrides[req.route.name]);
    }
    const expiresDate = new Date();
    expiresDate.setSeconds(expiresDate.getSeconds() + cacheSeconds);
    res.setHeader(
      'Expires',
      expiresDate.toUTCString(),
    );
    res.cache({ maxAge: cacheSeconds });
  }

  return next();
};

module.exports = {
  enhanceReponseHeaders,
};
