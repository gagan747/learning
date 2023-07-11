const { ApiClient, ApiAuthentication } = require('@tabdigital/api-client');

const config = require('./config');
const log = require('./log');

let client;
let defaultClient;

const getClient = () => {
  if (client) {
    return client;
  }

  const cfg = config.get();

  client = new ApiClient({
    authentication: cfg.identityService.enabled !== true
      ? null
      : new ApiAuthentication(cfg.identityService.url, {
        clientId: cfg.identityService.clientId,
        clientSecret: cfg.identityService.clientSecret,
        grantType: 'client_credentials',
      }),
    defaultRequestOpts: {
      forever: true,
    },
  });

  return client;
};

const getDefaultClient = () => {
  if (defaultClient) {
    return defaultClient;
  }

  defaultClient = new ApiClient({
    defaultRequestOpts: {
      forever: true,
    },
  });

  return defaultClient;
};

const getter = (useDefaultClient) => {
  const apiClient = useDefaultClient ? getDefaultClient() : getClient();

  return (url, urlParams) => apiClient
    .get(url, { urlParams })
    .catch((err) => {
      log.error(err, { failRequest: { url, urlParams } });
      throw err;
    });
};

const get = getter();

const getDefault = getter(true);

module.exports = {
  get,
  getDefault,
};
