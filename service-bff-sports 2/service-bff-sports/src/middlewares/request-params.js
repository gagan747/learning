/* eslint-disable no-param-reassign */

const fixJurisdictionCasing = (query) => {
  if (query && query.jurisdiction) {
    query.jurisdiction = query.jurisdiction.toUpperCase();
  }
};
const fixPlatformCasing = (query) => {
  if (query && query.platform) {
    query.platform = query.platform.toLowerCase();
  }
};
const fixOSCasing = (query) => {
  if (query && query.os) {
    query.os = query.os.toLowerCase();
  }
};

const formatRequestParams = (req, res, next) => {
  // Make the jurisdiction parameter as Uppercase
  fixJurisdictionCasing(req.query);

  // Make the platform parameter as Lowercase
  fixPlatformCasing(req.query);

  // Make the platform parameter as Lowercase
  fixOSCasing(req.query);

  return next();
};

module.exports = {
  formatRequestParams,
};
